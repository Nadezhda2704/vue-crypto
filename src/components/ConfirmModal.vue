<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center ">
    <div @click="closeModal()" class="absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm"></div>
    <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

      <!-- Кнопка-крестик -->
      <button
          @click="closeModal()"
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
          aria-label="Закрыть"
      >
        <!-- Иконка крестика (SVG) -->
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Контент модалки -->
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Заголовок модалки</h2>
      <p class="text-gray-600 mb-6">
        Это пример содержимого модального окна. Добавьте сюда любой текст, форму или предупреждение.
      </p>

      <div class="flex justify-between">
        <button @click="closeModal()" class="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition">
          Отмена
        </button>
        <button @click="ConfirmAndClose()" class="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition">
          ОК
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    emits: {
      'confirmAndClose': true,
      'closeModal': true,
    },
    methods: {
      closeModal() {
        this.$emit('closeModal');
      },
      ConfirmAndClose() {
        this.$emit('confirmAndClose');
      }
    }
  }
</script>