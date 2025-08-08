<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    @click.self="$emit('close')"
  >
    <div
      class="bg-[#18181b] rounded-lg shadow-xl p-8 w-full max-w-md text-white"
    >
      <h2 class="text-2xl font-bold mb-6">업로드 테스트 시작</h2>

      <div class="mb-6">
        <label
          for="file-upload"
          class="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-[#23232a] border-2 border-dashed border-[#4a4a52] rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
        >
          <span class="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h4l2 2h4a2 2 0 012 2v2M7 16V9m0 0l-2.121-2.121M7 16l2.121 2.121"
              />
            </svg>
            <span class="font-medium text-gray-400">
              테스트할 파일을 드래그하거나
              <span class="text-[#0C52EF]">클릭하여 선택</span>
            </span>
          </span>
          <input
            id="file-upload"
            type="file"
            class="hidden"
            @change="handleFileChange"
          />
        </label>
      </div>

      <div v-if="selectedFile" class="mb-4 bg-[#23232a] p-3 rounded-md">
        <p class="text-lg font-semibold">선택된 파일:</p>
        <p class="text-sm text-gray-300">
          {{ selectedFile.name }} ({{
            (selectedFile.size / 1024 / 1024).toFixed(2)
          }}
          MB)
        </p>
      </div>

      <div class="mb-6">
        <label for="repetitions" class="block text-lg font-semibold mb-2"
          >반복 횟수:</label
        >
        <input
          type="number"
          id="repetitions"
          v-model.number="repetitions"
          class="w-full px-3 py-2 bg-[#23232a] rounded-md border border-[#4a4a52] focus:outline-none focus:border-[#0C52EF]"
        />
      </div>

      <div class="flex justify-end gap-4">
        <button
          @click="$emit('close')"
          class="px-6 py-2 rounded-lg border border-[#4a4a52] hover:bg-[#23232a]"
        >
          취소
        </button>
        <button
          @click="startUploadTest"
          :disabled="!selectedFile || repetitions <= 0"
          class="px-6 py-2 rounded-lg bg-[#0C52EF] disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          테스트 시작
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['close', 'start-upload']);

const selectedFile = ref(null);
const repetitions = ref(100);

const handleFileChange = (event) => {
  if (event.target.files.length > 0) {
    selectedFile.value = event.target.files[0];
  }
};

const startUploadTest = () => {
  if (selectedFile.value && repetitions.value > 0) {
    emit('start-upload', {
      file: selectedFile.value,
      repetitions: repetitions.value,
    });
  }
};
</script>
