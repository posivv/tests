<template>
  <div class="bg-[#080809]">
    <div class="flex min-h-screen text-white">
      <div class="w-[264px] p-5">
        <div class="p-5">
          <img src="/src/assets/logo.png" alt="logo" class="w-[174px]" />
        </div>
        <div class="flex flex-col">
          <div class="text-[#878691] p-5 rounded-lg cursor-not-allowed">
            프로젝트 개요
          </div>
          <div class="text-[#878691] p-5 rounded-lg cursor-not-allowed">
            프로젝트 키워드
          </div>
          <div
            class="font-bold bg-[#0C52EF] p-5 rounded-lg cursor-pointer"
            :class="{
              'bg-opacity-50': isTesting || isDownloading || isDeleting,
            }"
          >
            공유 드라이브
          </div>
          <div class="text-[#878691] p-5 rounded-lg cursor-not-allowed">
            디자인 시안
          </div>
          <div class="text-[#878691] p-5 rounded-lg cursor-not-allowed">
            최종 디자인
          </div>
        </div>
      </div>
      <div class="flex flex-col p-5 flex-1">
        <div class="flex justify-between items-center pb-5">
          <div class="flex gap-5 items-end">
            <div class="text-[40px] font-extrabold">Storage</div>
            <div class="text-[24px] font-semibold mb-1">공유 드라이브</div>
          </div>
          <div class="flex gap-2">
            <button
              @click="startDeleteTest"
              :disabled="
                selectedFiles.length === 0 ||
                isTesting ||
                isDownloading ||
                isDeleting
              "
              class="border border-[#e53e3e] text-[#e53e3e] px-4 py-2 rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:border-[#4a4a52] disabled:text-[#878691]"
            >
              삭제
            </button>
            <button
              @click="startDownloadTest"
              :disabled="
                selectedFiles.length === 0 ||
                isTesting ||
                isDownloading ||
                isDeleting
              "
              class="border border-[#0C52EF] text-[#0C52EF] px-4 py-2 rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:border-[#4a4a52] disabled:text-[#878691]"
            >
              다운로드
            </button>
            <button
              @click="openUploadModal"
              :disabled="isTesting || isDownloading || isDeleting"
              class="bg-[#0C52EF] text-white px-4 py-2 rounded-lg cursor-pointer disabled:bg-opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!isTesting && !isDownloading && !isDeleting"
                >업로드</span
              >
              <span v-else-if="isTesting && !isTestFinished"
                >업로드 진행중...</span
              >
              <span v-else-if="isTesting && isTestFinished">업로드 완료</span>
              <span v-else-if="isDownloading && !isDownloadTestFinished"
                >다운로드 진행중...</span
              >
              <span v-else-if="isDownloading && isDownloadTestFinished"
                >다운로드 완료</span
              >
              <span v-else-if="isDeleting && !isDeleteTestFinished"
                >삭제 진행중...</span
              >
              <span v-else-if="isDeleting && isDeleteTestFinished"
                >삭제 완료</span
              >
              <span v-else>테스트 진행중...</span>
            </button>
          </div>
        </div>
        <div
          v-if="isTesting"
          class="flex flex-col flex-1 bg-[#18181b] rounded-lg p-5"
        >
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-2xl font-bold">업로드 테스트 진행 상황</h3>
            <div class="text-lg">
              <span class="font-bold">{{
                uploadStats.completed + uploadStats.failed
              }}</span>
              /
              <span class="font-bold">{{ uploadJobs.length }}</span>
              (<span class="text-green-400"
                >성공: {{ uploadStats.completed }}</span
              >, <span class="text-red-400">실패: {{ uploadStats.failed }}</span
              >)
            </div>
          </div>
          <div class="flex-grow overflow-y-auto pr-2">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                v-for="job in uploadJobs"
                :key="job.id"
                class="bg-[#23232a] p-3 rounded-lg text-sm"
              >
                <div class="flex justify-between items-center mb-2">
                  <span class="font-bold">업로드 #{{ job.id }}</span>
                  <span
                    :class="statusColor(job.status)"
                    class="px-2 py-1 rounded-full text-xs font-semibold"
                    >{{ job.status }}</span
                  >
                </div>
                <div class="w-full bg-[#18181b] rounded-full h-2.5 mb-1">
                  <div
                    class="h-2.5 rounded-full"
                    :class="progressBarColor(job.status)"
                    :style="{ width: job.progress + '%' }"
                  ></div>
                </div>
                <div class="text-right text-xs font-mono">
                  {{ job.progress }}%
                </div>
                <div
                  v-if="job.error"
                  class="text-red-400 mt-1 text-xs truncate"
                >
                  Error: {{ job.error }}
                </div>
              </div>
            </div>
          </div>
          <button
            @click="resetTest"
            class="mt-4 w-full bg-[#0C52EF] text-white px-4 py-2 rounded-lg cursor-pointer disabled:bg-opacity-50 disabled:cursor-not-allowed"
            :disabled="!isTestFinished"
          >
            테스트 목록으로 돌아가기
          </button>
        </div>

        <div
          v-else-if="isDownloading"
          class="flex flex-col flex-1 bg-[#18181b] rounded-lg p-5"
        >
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-2xl font-bold">다운로드 테스트 진행 상황</h3>
            <div class="text-lg">
              <span class="font-bold">{{
                downloadStats.completed + downloadStats.failed
              }}</span>
              /
              <span class="font-bold">{{ downloadJobs.length }}</span>
              (<span class="text-green-400"
                >성공: {{ downloadStats.completed }}</span
              >,
              <span class="text-red-400">실패: {{ downloadStats.failed }}</span
              >)
            </div>
          </div>
          <div class="flex-grow overflow-y-auto pr-2">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                v-for="job in downloadJobs"
                :key="job.id"
                class="bg-[#23232a] p-3 rounded-lg text-sm"
              >
                <div class="flex justify-between items-center mb-2">
                  <span class="font-bold truncate" :title="job.name"
                    >다운로드: {{ job.name }}</span
                  >
                  <span
                    :class="statusColor(job.status)"
                    class="px-2 py-1 rounded-full text-xs font-semibold"
                    >{{ job.status }}</span
                  >
                </div>
                <div class="w-full bg-[#18181b] rounded-full h-2.5 mb-1">
                  <div
                    class="h-2.5 rounded-full"
                    :class="progressBarColor(job.status)"
                    :style="{ width: job.progress + '%' }"
                  ></div>
                </div>
                <div class="text-right text-xs font-mono">
                  {{ job.progress }}%
                </div>
                <div
                  v-if="job.error"
                  class="text-red-400 mt-1 text-xs truncate"
                >
                  Error: {{ job.error }}
                </div>
              </div>
            </div>
          </div>
          <button
            @click="resetTest"
            class="mt-4 w-full bg-[#0C52EF] text-white px-4 py-2 rounded-lg cursor-pointer disabled:bg-opacity-50 disabled:cursor-not-allowed"
            :disabled="!isDownloadTestFinished"
          >
            테스트 목록으로 돌아가기
          </button>
        </div>
        <div
          v-else-if="isDeleting"
          class="flex flex-col flex-1 bg-[#18181b] rounded-lg p-5"
        >
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-2xl font-bold">삭제 테스트 진행 상황</h3>
            <div class="text-lg">
              <span class="font-bold">{{
                deleteStats.completed + deleteStats.failed
              }}</span>
              /
              <span class="font-bold">{{ deleteJobs.length }}</span>
              (<span class="text-green-400"
                >성공: {{ deleteStats.completed }}</span
              >, <span class="text-red-400">실패: {{ deleteStats.failed }}</span
              >)
            </div>
          </div>
          <div class="flex-grow overflow-y-auto pr-2">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                v-for="job in deleteJobs"
                :key="job.id"
                class="bg-[#23232a] p-3 rounded-lg text-sm"
              >
                <div class="flex justify-between items-center mb-2">
                  <span class="font-bold truncate" :title="job.name"
                    >삭제: {{ job.name }}</span
                  >
                  <span
                    :class="statusColor(job.status)"
                    class="px-2 py-1 rounded-full text-xs font-semibold"
                    >{{ job.status }}</span
                  >
                </div>
                <div
                  v-if="job.error"
                  class="text-red-400 mt-1 text-xs truncate"
                >
                  Error: {{ job.error }}
                </div>
              </div>
            </div>
          </div>
          <button
            @click="resetTest"
            class="mt-4 w-full bg-[#0C52EF] text-white px-4 py-2 rounded-lg cursor-pointer disabled:bg-opacity-50 disabled:cursor-not-allowed"
            :disabled="!isDeleteTestFinished"
          >
            테스트 목록으로 돌아가기
          </button>
        </div>
        <div v-else class="flex flex-col flex-1">
          <div
            class="grid grid-cols-12 gap-4 px-4 py-2 text-[#878691] bg-[#23232a]"
          >
            <div class="col-span-1">
              <input
                type="checkbox"
                v-model="selectAll"
                @change="toggleSelectAll"
                class="form-checkbox h-5 w-5 bg-transparent border-[#878691] rounded text-[#0C52EF] focus:ring-0"
              />
            </div>
            <div class="col-span-5">파일명</div>
            <div class="col-span-3">등록일</div>
            <div class="col-span-3">용량</div>
          </div>
          <div class="flex-grow bg-[#18181b] rounded-b-lg">
            <div
              v-if="paginatedFiles.length === 0"
              class="text-center py-10 text-[#878691]"
            >
              파일이 없습니다.
            </div>
            <div
              v-for="file in paginatedFiles"
              :key="file.id"
              class="grid grid-cols-12 gap-4 items-center px-4 py-3 border-t border-[#23232a] hover:bg-[#2a2a2f] cursor-pointer"
              @click="toggleFileSelection(file.id)"
            >
              <div class="col-span-1 flex items-center">
                <input
                  type="checkbox"
                  :checked="isSelected(file.id)"
                  @change.stop="toggleFileSelection(file.id)"
                  @click.stop
                  class="form-checkbox h-5 w-5 bg-transparent border-[#878691] rounded text-[#0C52EF] focus:ring-0"
                />
              </div>
              <div class="col-span-5 flex items-center space-x-3">
                <svg
                  class="w-6 h-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  ></path>
                </svg>
                <span>{{ file.name }}</span>
              </div>
              <div class="col-span-3 text-[#878691]">{{ file.date }}</div>
              <div class="col-span-3 text-[#878691]">{{ file.size }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <UploadModal
    v-if="showUploadModal"
    @close="closeUploadModal"
    @start-upload="startUploadTest"
  />
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import UploadModal from './components/UploadModal.vue';
import { useFileStore } from './stores/fileStore';

const fileStore = useFileStore();

const selectAll = ref(false);
const selectedFiles = ref([]);
const showUploadModal = ref(false);

const isTesting = ref(false);
const uploadJobs = ref([]);
const isDownloading = ref(false);
const downloadJobs = ref([]);
const isDeleting = ref(false);

const deleteJobs = ref([]);

const paginatedFiles = computed(() => {
  if (isTesting.value || isDownloading.value || isDeleting.value) return [];
  return fileStore.files;
});
const uploadStats = computed(() => {
  const stats = { completed: 0, failed: 0 };
  uploadJobs.value.forEach((job) => {
    if (job.status === 'completed') stats.completed++;
    if (job.status === 'failed') stats.failed++;
  });
  return stats;
});
const isTestFinished = computed(() => {
  if (!isTesting.value) return false;
  const finished =
    uploadJobs.value.length > 0 &&
    uploadStats.value.completed + uploadStats.value.failed ===
      uploadJobs.value.length;

  return finished;
});
const downloadStats = computed(() => {
  const stats = { completed: 0, failed: 0 };
  downloadJobs.value.forEach((job) => {
    if (job.status === 'completed') stats.completed++;
    if (job.status === 'failed') stats.failed++;
  });
  return stats;
});
const isDownloadTestFinished = computed(() => {
  if (!isDownloading.value) return false;
  const finished =
    downloadJobs.value.length > 0 &&
    downloadStats.value.completed + downloadStats.value.failed ===
      downloadJobs.value.length;

  return finished;
});

const deleteStats = computed(() => {
  const stats = { completed: 0, failed: 0 };
  deleteJobs.value.forEach((job) => {
    if (job.status === 'completed') stats.completed++;
    if (job.status === 'failed') stats.failed++;
  });
  return stats;
});

const isDeleteTestFinished = computed(() => {
  if (!isDeleting.value) return false;
  const finished =
    deleteJobs.value.length > 0 &&
    deleteStats.value.completed + deleteStats.value.failed ===
      deleteJobs.value.length;

  return finished;
});

const openUploadModal = () => {
  showUploadModal.value = true;
};
const closeUploadModal = () => {
  showUploadModal.value = false;
};

const isSelected = (fileId) => selectedFiles.value.includes(fileId);
const statusColor = (status) => {
  const colors = {
    queued: 'bg-gray-500',
    fetching_url: 'bg-yellow-500',
    uploading: 'bg-blue-500',
    downloading: 'bg-blue-500',
    deleting: 'bg-purple-500',
    completed: 'bg-green-500',
    failed: 'bg-red-500',
  };
  return colors[status] || 'bg-gray-500';
};
const progressBarColor = (status) => {
  const colors = {
    completed: 'bg-green-400',
    failed: 'bg-red-400',
  };
  return colors[status] || 'bg-blue-400';
};

const resetTest = () => {
  isTesting.value = false;
  isDownloading.value = false;
  isDeleting.value = false;
  uploadJobs.value = [];
  downloadJobs.value = [];
  deleteJobs.value = [];
};

const toggleSelectAll = () => {
  selectedFiles.value = [];
  if (selectAll.value) {
    paginatedFiles.value.forEach((file) => selectedFiles.value.push(file.id));
  }
};

const toggleFileSelection = (fileId) => {
  const index = selectedFiles.value.indexOf(fileId);
  if (index > -1) selectedFiles.value.splice(index, 1);
  else selectedFiles.value.push(fileId);
};

const startUploadTest = async ({ file, repetitions }) => {
  isTesting.value = true;
  closeUploadModal();
  uploadJobs.value = Array.from({ length: repetitions }, (_, i) => ({
    id: i + 1,
    file: file,
    progress: 0,
    status: 'queued',
    error: null,
  }));

  const jobsToProcess = [...uploadJobs.value];
  const concurrency = 3;
  const workerPromises = Array(concurrency)
    .fill(null)
    .map(() => runWorker(jobsToProcess));

  await Promise.all(workerPromises);

  console.log('모든 테스트 업로드가 완료되었습니다.');
};

const runWorker = async (jobsQueue) => {
  while (jobsQueue.length > 0) {
    const job = jobsQueue.shift();
    if (job) await processJob(job);
  }
};

const processJob = async (job) => {
  let BlockBlobClient;
  try {
    ({ BlockBlobClient } = await import('@azure/storage-blob'));
  } catch (importError) {
    console.error('Azure Blob SDK 로드 실패:', importError);
    job.status = 'failed';
    job.error = 'SDK 로드 실패';
    return;
  }

  try {
    job.status = 'fetching_url';
    job.progress = 5;
    const sasData = await getSasUrl(job.file);
    if (!sasData || !sasData.uploadUrl || !sasData.blobName) {
      throw new Error('유효한 SAS 데이터를 받아오지 못했습니다.');
    }

    job.status = 'uploading';
    await uploadToAzure(job, sasData.uploadUrl, BlockBlobClient);

    const newFile = {
      id: Date.now() + Math.random(),
      name: job.file.name,
      date: new Date().toISOString().split('T')[0],
      size: `${(job.file.size / 1024 / 1024).toFixed(2)}MB`,
      type: job.file.type.split('/')[0] || 'file',
      blobName: sasData.blobName,
    };
    fileStore.addFile(newFile);

    job.status = 'completed';
    job.progress = 100;
  } catch (error) {
    job.status = 'failed';
    job.error = error.message.substring(0, 50);
    console.error(`작업 #${job.id} 실패:`, error);
  }
};

const startDownloadTest = async () => {
  if (selectedFiles.value.length === 0) return;

  const filesToDownload = fileStore.files.filter(
    (file) => selectedFiles.value.includes(file.id) && file.blobName
  );

  if (filesToDownload.length === 0) {
    alert('다운로드는 현재 세션에서 업로드한 파일만 가능합니다.');
    return;
  }

  isDownloading.value = true;

  downloadJobs.value = filesToDownload.map((file, i) => ({
    id: i + 1,
    file: file,
    name: file.name,
    progress: 0,
    status: 'queued',
    error: null,
  }));

  const jobsToProcess = [...downloadJobs.value];
  const concurrency = 3;
  const workerPromises = Array(concurrency)
    .fill(null)
    .map(() => runDownloadWorker(jobsToProcess));

  await Promise.all(workerPromises);
  console.log('모든 테스트 다운로드가 완료되었습니다.');
};

const runDownloadWorker = async (jobsQueue) => {
  while (jobsQueue.length > 0) {
    const job = jobsQueue.shift();
    if (job) await processDownloadJob(job);
  }
};

const processDownloadJob = async (job) => {
  try {
    job.status = 'fetching_url';
    job.progress = 5;
    const sasUrl = await getDownloadSasUrl(job.file);
    if (!sasUrl) throw new Error('다운로드 SAS URL을 받아오지 못했습니다.');

    job.status = 'downloading';
    await downloadFromAzure(job, sasUrl);

    job.status = 'completed';
    job.progress = 100;
  } catch (error) {
    job.status = 'failed';
    job.error = error.message.substring(0, 50);
    console.error(`다운로드 작업 #${job.id} 실패:`, error);
  }
};

const startDeleteTest = async () => {
  if (selectedFiles.value.length === 0) return;

  const filesToDelete = fileStore.files.filter(
    (file) => selectedFiles.value.includes(file.id) && file.blobName
  );
  if (filesToDelete.length === 0) {
    alert(
      '삭제할 수 있는 파일이 없습니다 (세션 내에서 업로드된 파일만 삭제 가능).'
    );
    return;
  }
  if (
    !confirm(
      `선택된 ${filesToDelete.length}개의 파일을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
    )
  ) {
    return;
  }

  isDeleting.value = true;
  selectedFiles.value = [];

  deleteJobs.value = filesToDelete.map((file, i) => ({
    id: i + 1,
    file: file,
    name: file.name,
    status: 'queued',
    error: null,
  }));

  try {
    const blobNames = filesToDelete.map((f) => f.blobName);
    const response = await fetch(
      'https://dev-api.nullz.co.kr/v1/delete-files/',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blobNames }),
      }
    );

    if (!response.ok) {
      throw new Error(`SAS URL 요청 실패: ${response.statusText}`);
    }

    const { deleteTasks } = await response.json();

    deleteJobs.value.forEach((job) => {
      const task = deleteTasks.find((t) => t.blobName === job.file.blobName);
      job.deleteUrl = task?.deleteUrl;
    });

    const jobsToProcess = [...deleteJobs.value];

    const concurrency = 3;
    const workerPromises = Array(concurrency)
      .fill(null)
      .map(() => runDeleteWorker(jobsToProcess));

    await Promise.all(workerPromises);
    console.log('모든 삭제 작업이 완료되었습니다.');
  } catch (error) {
    console.error('삭제 처리 중 오류 발생:', error);
    deleteJobs.value.forEach((job) => {
      if (job.status === 'queued') {
        job.status = 'failed';
        job.error = 'SAS URL 획득 실패';
      }
    });
  }
};

const runDeleteWorker = async (jobsQueue) => {
  while (jobsQueue.length > 0) {
    const job = jobsQueue.shift();
    if (job) await processDeleteJob(job);
  }
};

const processDeleteJob = async (job) => {
  if (!job.deleteUrl) {
    job.status = 'failed';
    job.error = '삭제 URL 없음';
    return;
  }
  try {
    job.status = 'deleting';

    const response = await fetch(job.deleteUrl, { method: 'DELETE' });

    if (!response.ok) {
      throw new Error(`Azure 응답 실패: ${response.status}`);
    }

    job.status = 'completed';
    fileStore.removeFileByBlobName(job.file.blobName);
  } catch (error) {
    job.status = 'failed';
    job.error = error.message.substring(0, 50);
    console.error(`삭제 작업 #${job.id} 실패:`, error);
  }
};

const getSasUrl = async (file) => {
  try {
    const response = await fetch(
      'https://dev-api.nullz.co.kr/v1/upload-files/',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, contentType: file.type }),
      }
    );
    if (!response.ok) {
      throw new Error(`API 서버 오류: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[getSasUrl] API 호출 실패:', error);
    throw error;
  }
};

const uploadToAzure = async (job, sasUrl, BlockBlobClient) => {
  const file = job.file;
  const blockBlobClient = new BlockBlobClient(sasUrl);

  const getChunkSize = (fileSize) => {
    if (fileSize < 100 * 1024 * 1024) return 8 * 1024 * 1024;
    if (fileSize < 500 * 1024 * 1024) return 16 * 1024 * 1024;
    return 32 * 1024 * 1024;
  };

  const chunkSize = getChunkSize(file.size);

  if (file.size < chunkSize) {
    await blockBlobClient.uploadData(file, {
      onProgress: (ev) => {
        job.progress = Math.round((ev.loadedBytes / file.size) * 100);
      },
    });
    return;
  }

  const totalChunks = Math.ceil(file.size / chunkSize);
  const blockIds = [];

  for (let i = 0; i < totalChunks; i++) {
    const blockId = btoa(`block-${String(i).padStart(6, '0')}`);
    blockIds.push(blockId);

    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    await blockBlobClient.stageBlock(blockId, chunk, end - start);

    job.progress = Math.round(((i + 1) / totalChunks) * 99);
  }

  await blockBlobClient.commitBlockList(blockIds, {
    blobHTTPHeaders: {
      blobContentType: file.type || 'application/octet-stream',
    },
  });
};

const getDownloadSasUrl = async (file) => {
  try {
    const response = await fetch(
      'https://dev-api.nullz.co.kr/v1/download-files/',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.blobName }),
      }
    );
    if (!response.ok) {
      throw new Error(`API 서버 오류: ${response.statusText}`);
    }
    const data = await response.json();
    return data.downloadUrl;
  } catch (error) {
    console.error('[getDownloadSasUrl] API 호출 실패:', error);
    throw error;
  }
};

const downloadFromAzure = async (job, sasUrl) => {
  const response = await fetch(sasUrl);
  if (!response.ok) {
    throw new Error(`서버 응답 ${response.status}`);
  }

  const contentLength = +response.headers.get('Content-Length');
  const chunks = [];

  if (!contentLength) {
    const blob = await response.blob();
    chunks.push(blob);
    job.progress = 100;
  } else {
    const reader = response.body.getReader();
    let loaded = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        job.progress = 100;
        break;
      }
      chunks.push(value);
      loaded += value.length;
      job.progress = Math.round((loaded / contentLength) * 100);
    }
  }

  const blob = new Blob(chunks, {
    type: job.file.type || 'application/octet-stream',
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = job.file.name;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

watch(selectedFiles, () => {
  if (paginatedFiles.value.length > 0) {
    selectAll.value = paginatedFiles.value.every((file) =>
      selectedFiles.value.includes(file.id)
    );
  } else {
    selectAll.value = false;
  }
});
</script>

<style scoped></style>
