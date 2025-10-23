<template>
  <div class="wrap">
    <div class="modal border-2 p-4">
      <button class="close" @click="closeModal()">x</button>
      <div class="content">
        <div class="title">Title</div>
        <div class="text">Text</div>
      </div>

      <div class="footer">
        <div class="controllers">
          <button
            @click="ConfirmAndClose()"
            class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >ok</button>
        </div>
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