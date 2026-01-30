<template>
  <section class="container">
    <div id="Digital-Man"></div>

    <div class="main">
      <input
        v-model="inputText"
        type="textarea"
        placeholder="Please enter text"
        class="input"
        @keyup.enter="send"
      />

      <!-- Language Selection -->
      <div class="language-selector">
        <label for="language">Language:</label>
        <select v-model="ttsLanguage" @change="onLanguageChange" class="language-select">
          <option value="zh">Chinese</option>
          <option value="en">English</option>
          <option value="yue">Cantonese</option>
        </select>
      </div>
      <!-- Basic Control Buttons -->
      <div class="btn-box">
        <span class="btn" @click="send()">Send</span>
        <!--<span class="btn" @click="send(1)">Send Long Text</span>-->
        <span class="btn" @click="interrupt">Interrupt</span>
        <span class="btn" @click="closeSession">Close</span>
        <span class="btn" @click="func">Multiple Texts</span>
      </div>
      
      <!-- Volume Control -->
      <div class="btn-box">
        Volume:
        <input type="range" v-model="volume" min="0" max="10" step="1" class="silder-input" @change="setVolume" />
        {{ volume || 0 }}
        <span class="btn m-l-10" @click="setMuted(true)">Mute</span>
        <span class="btn" @click="setMuted(false)">Unmute</span>
      </div>

      <div class="btn-box">
        Speed:
        <input type="range" v-model="speed" min="0" max="10" step="1" class="silder-input" @change="setSpeed" />
        {{ speed || 0 }}
      </div>

      <!-- Status Display -->
      <div class="status-section">
        <div>Current Text: {{ currentText }}</div>
        <div>Current Queue:
          <div class="queue-list">
            <div v-for="(txt, index) in queue" :key="index" class="queue-item">
              {{ index + 1 }}. {{ txt }}
            </div>
          </div>
        </div>
        <div>Current Final State: {{ isFinal }}</div>
        <div style="margin-top: 10px; font-weight: bold;" :style="{ color: initStatus.includes('Failed') ? 'red' : 'blue' }">
            Init Status: {{ initStatus }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { DigitalMan } from '../utils/DigitalMan.js'
import { ref, onMounted, onUnmounted } from 'vue'

let VM = null
// Text input
const inputText = ref('')
// Current text
const currentText = ref('')
// Current queue
const queue = ref([])
// Current final state
const isFinal = ref('Yes')

// TTS related
const ttsLanguage = ref('yue')
const initStatus = ref('Waiting...')
const supportedLanguages = {
  zh: 'Chinese',
  en: 'English', 
  yue: 'Cantonese'
}

// Send text
async function send(type = '') {
  if (inputText.value.trim() !== '') {
    await VM._streamCommand(inputText.value, type, ttsLanguage.value)
    inputText.value = '' // Clear input box
  }
}
// Interrupt
async function interrupt() {
  await VM._interrupt()
}
// Send final flag
async function stop() {
  await VM._streamEnd()
}
// Close session
async function closeSession() {
  VM._closeConnection()
}

// Text array
const textArray = ref([
  'Hello, I am a digital human! Nice to meet you! You can ask me any questions! Feel free to come to me anytime! Nice to meet you! 1 You can ask me any questions! Feel free to come to me anytime! Nice to meet you! You can ask me any questions! 88 Feel free to come to me anytime! Nice to meet you! You can ask me any questions! Feel free to come to me anytime! 00 Nice to meet you! You can ask me any questions! Feel free to come to me anytime!',
  'This is the 2nd sentence, nice to meet you! How can I help you? You can ask me any questions! Feel free to come to me anytime!',
  'This is the 3rd sentence, nice to meet you! How can I help you? You can ask me any questions! Feel free to come to me anytime!',
  'This is the 4th sentence, nice to meet you! How can I help you? You can ask me any questions! Feel free to come to me anytime!',
  'This is the 5th sentence, nice to meet you! How can I help you? You can ask me any questions! Feel free to come to me anytime!',
])
// Batch send, play in queue order
async function func() {
  for (const item of textArray.value) {
    await VM._streamCommand(item, 0, ttsLanguage.value)
  }
}

/**
 * @desc Set mute
*/
const setMuted = (type) => {
  VM._setMuted(type)
}

const volume = ref(10)
const setVolume = () => {
  VM._setVolume(volume.value)
}

/**
 * @desc Adjust speed
*/
const speed = ref(5)
const setSpeed = () => {
  VM._setTTSSpeed(speed.value)
}

onMounted(async () => {
  // Ensure unique session name for each run
  const DM_CONFIG = {
    appkey: '486da5fd9397a2bedb1ed3a2c15e89be',
    appsecret: '864fbc28339cb8882560997adbd92845',
    licenseUrl: 'https://1251097609.trtcube-license.cn/license/v2/1251097609_1/v_cube.license',
    figure_id: '35967f5', 
    voice_id: '10a1120', 
    mobile: '13436983578', 
    name: 'ServerModeSession_' + Date.now(),
    voice_volume: 10,
    voice_speed: 5
  }

  VM = new DigitalMan(DM_CONFIG)

  VM.setCurrentTextCallback((ct, que, final) => {
    currentText.value = ct
    queue.value = que
    isFinal.value = final
  })

  try {
      console.log('🚀 [test.vue] Calling _initializer()...');
      initStatus.value = '🚀 Initializing...';
      await VM._initializer()
      console.log('✅ [test.vue] Init Success');
      initStatus.value = '✅ Init Success';
  } catch (e) {
      console.error('❌ [test.vue] Init Failed:', e);
      initStatus.value = '❌ Init Failed: ' + e.message;
  }
})

function onLanguageChange() {
  if (VM) {
    VM._setTTSLanguage(ttsLanguage.value)
    console.log('[test.vue] Switch TTS language:', ttsLanguage.value)
  }
}

onUnmounted(() => {})
</script>

<style scoped>
.m-l-10 {
  margin-left: 10px;
}
.container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  overflow-y: auto;
}
#Digital-Man {
  width: 400px;
  height: 400px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  border: 5px solid red; /* Make it very obvious */
  background-color: #eee; /* Light gray background to see if div exists */
}
.main {
  min-width: 400px;
  display: flex;
  flex-direction: column;
  margin-left: 10%;
  box-sizing: border-box;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 15px;
}
.input {
  width: 100%;
  margin-bottom: 10px;
  padding: 5px 10px;
  font-size: 16px;
  box-sizing: border-box;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.btn-box {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.btn-box .btn {
  padding: 1px 5px;
  margin-right: 10px;
  background-color: #007bff;
  cursor: pointer;
  color: white;
  border-radius: 5px;
  font-size: 15px;
  border: none;
  transition: background-color 0.3s;
}

.btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.language-selector {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 10px;
}

.language-selector label {
  font-weight: 500;
  color: #495057;
}
.language-select {
  padding: 5px 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
}

.silder-input {
  flex: 1;
  margin-right: 10px;
}

/* Status display styles */
.status-section {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.status-section > div {
  margin-bottom: 8px;
  font-size: 14px;
  color: #495057;
}

.queue-list {
  max-height: 150px;
  overflow-y: auto;
  margin-top: 5px;
  padding: 5px;
  background-color: white;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

.queue-item {
  padding: 3px 5px;
  font-size: 12px;
  color: #6c757d;
  border-bottom: 1px solid #f1f3f4;
}

.queue-item:last-child {
  border-bottom: none;
}

/* Responsive design */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    padding: 20px;
  }
  
  #Digital-Man {
    width: 300px;
    height: 300px;
    margin-bottom: 20px;
  }
  
  .main {
    min-width: 300px;
    padding-left: 0;
  }
  
  .btn-box {
    justify-content: center;
  }
  
  .language-selector {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
