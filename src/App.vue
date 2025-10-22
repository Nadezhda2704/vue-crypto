<template>
  <div class="container p-3">
    <add-ticker @add-ticker="add" :assets="assets" :showErrorExist="showErrorExist" />

    <template v-if="tickers.length">
      <hr class="w-full border-t border-gray-600 my-4" />
      <div>
        <button
          @click="page = page - 1"
          v-if="page > 1"
          type="button"
          class="my-4 mr-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >Назад</button>
        <button
          @click="page = page + 1"
          v-if="hasNextPage"
          type="button"
          class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >Вперед</button>
      </div>

      <div class="flex justify-between items-center">
        <div>
          <label for="filter">Фильтр:</label>
          <input
            v-model="filter"
            type="text"
            name="filter"
            id="filter"
            class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            placeholder="Например DOGE"
          >
        </div>

        <button
          @click="deleteAll()"
          type="button"
          class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        ><svg
          class="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="#ffffff"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clip-rule="evenodd"
          ></path>
        </svg>
          <span class="pl-1">Удалить все</span>
          </button>
      </div>

      <hr class="w-full border-t border-gray-600 my-4" />

      <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <ticker-card
          v-for="(t, i) in tickersInCurrentPage"
          :key="i"
          @click="select(t)"
          :ticker="t"
          :selected-ticker="selectedTicker"
          @delete-ticker="handleDelete(t)"
        >
        </ticker-card>
      </dl>

      <hr class="w-full border-t border-gray-600 my-4" />
    </template>

    <div  v-if="selectedTicker">
      <ticker-graph
        @close-graph="selectedTicker = null"
        :priceCurrentTicker="priceCurrentTicker"
        :selectedTicker="selectedTicker"
      ></ticker-graph>
    </div>
  </div>
</template>

<script>

import {subscribeToTicker, unsubscribeFromTicker} from "@/api";
import AddTicker from "@/components/AddTicker.vue";
import TickerGraph from "@/components/TickerGraph.vue";
import TickerCard from "@/components/TickerCard.vue";

export default {
  name: 'App',

  components: {
    TickerCard,
    AddTicker,
    TickerGraph,
  },

  data() {
    return {
      filter: '',
      tickers: [],
      selectedTicker: null,
      showErrorExist: false,
      assets: [],
      page: 1,
      priceCurrentTicker: 0,
    }
  },

  created() {
    const windowData = Object.fromEntries(new URL(window.location).searchParams.entries())

    if (windowData.filter) {
      this.filter = windowData.filter
    }

    if (windowData.page) {
      this.page = +windowData.page
    }

    this.getAssets();
    const tickersData = localStorage.getItem('tickersList')

    if(tickersData) {
      this.tickers = JSON.parse(tickersData)

      this.tickers.forEach(ticker => {
        subscribeToTicker(ticker.name, newPrice =>
            this.updateTicker(ticker.name, newPrice)
        );
      });
    }
  },

  computed: {
    start() {
      return (this.page - 1)*6
    },

    end() {
      return this.page*6
    },

    filteredTickers() {
      return this.tickers
        .filter(ticker => ticker.name.includes(this.filter.trim().toUpperCase()) )
    },

    tickersInCurrentPage() {
      return this.filteredTickers.slice(this.start, this.end)
    },

    hasNextPage() {
      return this.filteredTickers.length > this.end
    },

    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page
      };
    }
  },

  methods: {
    updateTicker(tickerName, price) {
      this.tickers
        .filter(t => t.name === tickerName)
        .forEach(t => {
          if (t === this.selectedTicker) {
            this.priceCurrentTicker = price;
          }
          t.price = price;
        });
    },

    async getAssets() {
      const f = await fetch('https://data-api.coindesk.com/onchain/v3/summary/by/chain?chain_asset=ETH&asset_lookup_priority=SYMBOL')
      const data = await f.json()
      this.assets = data.Data.ASSETS_SUPPORTED.map(item => item.SYMBOL.toUpperCase())
    },

    add(ticker) {
      const tickersNames = this.tickers.map(item => item.name.toUpperCase());

      const currentTicker = {
        name: ticker,
        price: '-'
      }

      if( !tickersNames.includes(ticker) ) {
        this.tickers = [...this.tickers, currentTicker]

        subscribeToTicker(currentTicker.name, newPrice =>
          this.updateTicker(currentTicker.name, newPrice)
        );
      } else {
        this.showErrorExist = true
      }
    },

    select(ticker) {
      this.selectedTicker = ticker;
    },

    handleDelete(tickerToRemove) {
      this.tickers = this.tickers.filter((item) => item !== tickerToRemove)
      if (this.selectedTicker === tickerToRemove) {
        this.selectedTicker = null;
      }
      unsubscribeFromTicker(tickerToRemove.name);
    },

    deleteAll() {
      this.tickers.forEach(ticker => {
        this.handleDelete(ticker)
      })
    },
  },

  watch: {
    selectedTicker() {
      this.graph = []
    },

    tickers() {
      localStorage.setItem('tickersList', JSON.stringify(this.tickers))
    },

    tickersInCurrentPage() {
      if (this.tickersInCurrentPage.length === 0 && this.page > 1 ) {
        this.page -= 1
      }
    },

    filter() {
      this.page = 1
    },

    pageStateOptions(value) {
      const { pathname } = window.location
      window.history.pushState(
          null,
          document.title,
          `${pathname}?filter=${value.filter}&page=${value.page}`
      )
    }
  },
}
</script>
