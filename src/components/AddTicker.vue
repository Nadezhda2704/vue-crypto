<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
        >Тикер {{ticker}}</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            v-on:keydown.enter="add()"
            v-model="ticker"
            type="text"
            name="wallet"
            id="wallet"
            class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            placeholder="Например DOGE"
          />
        </div>
        <div v-if="hints.length" class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap">
          <span
            v-for="hint of hints"
            v-bind:key="hint"
            @click="add(hint)"
            class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
          >
            {{ hint }}
          </span>

        </div>
        <div v-if="showErrorExist" class="text-sm text-red-600">Такой тикер уже добавлен</div>
      </div>
    </div>
    <add-button @click="add" type="button" class="my-4" />
  </section>

</template>
<script>
  import AddButton from "@/components/AddButton.vue";

  export default {
    components: {
      AddButton
    },

    props: {
      assets: {
        type: Array,
        required: true
      },
      showErrorExist: {
        type: Boolean,
        required: true,
        default: false
      }
    },

    emits: {
      "add-ticker": value => typeof value === "string" && value.length > 0,
    },

    data() {
      return {
        ticker: '',
        hints: [],
      };
    },

    methods: {
      add(hint) {
        if(hint) {
          this.ticker = hint;
        }
        if(this.ticker.length === 0) {
          return;
        }
        this.ticker = this.ticker.toString().trim().toUpperCase();
        this.$emit('add-ticker', this.ticker);
        this.ticker = ''
      }
    },

    watch: {
      ticker(newTicker) {
        const value = newTicker.trim().toUpperCase()

        const matches = [...this.assets].filter((item) => {
          return item.startsWith(value)
        })

        this.hints = matches.slice(0, 4)
      },
    }
  };
</script>
