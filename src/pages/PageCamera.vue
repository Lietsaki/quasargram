<template>
  <q-page class="constrain-more q-pa-md">
    <div class="camera-frame q-pa-md">
      <video
        v-show="!capturedImage"
        ref="video"
        class="full-width rounded"
        autoplay
        playsinline
      />
      <canvas
        v-show="capturedImage"
        class="full-width rounded"
        ref="canvas"
        height="100rem"
      />
    </div>
    <div class="text-center q-pa-md">
      <q-btn
        v-if="hasCameraSupport"
        @click="captureImg"
        :disable="capturedImage"
        round
        size="lg"
        color="grey-10"
        icon="eva-camera"
      />
      <q-file
        v-else
        v-model="imgUpload"
        accept=".jpg, .jpeg, .png"
        outlined
        label="Choose an image..."
        @input="uploadImgFile"
      >
        <template v-slot:prepend>
          <q-icon name="eva-attach" />
        </template>
      </q-file>
      <div class="row justify-center q-ma-md">
        <q-input
          class="col-12 col-sm-6"
          label="Caption *"
          v-model="post.caption"
          dense
        />
      </div>
      <div class="row justify-center q-ma-md">
        <q-input
          class="col-12 col-sm-6"
          label="Location"
          v-model="post.location"
          dense
          :loading="loadingLocation"
        >
          <template v-slot:append>
            <q-icon
              v-if="!loadingLocation && locationSupported"
              @click="getLocation"
              name="eva-navigation-2-outline"
              dense
              flat
              round
              class="cursor-pointer"
            />
          </template>
        </q-input>
      </div>
      <div class="row justify-center q-mt-lg">
        <q-btn
          @click="addPost"
          :disable="!post.caption || !post.photo"
          unelevated
          rounded
          color="primary"
          label="Post Image"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { uid } from 'quasar';

require('md-gum-polyfill');

export default {
  name: 'PageCamera',
  data() {
    return {
      post: {
        caption: '',
        location: '',
        id: uid(),
        photo: null,
        date: Date.now()
      },
      capturedImage: false,
      hasCameraSupport: false,
      imgUpload: [],
      loadingLocation: false
    };
  },
  computed: {
    locationSupported() {
      return 'geolocation' in navigator;
    }
  },
  methods: {
    async initCamera() {
      // (getUserMedia returns a promise)
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        this.hasCameraSupport = true;
        // We'll catch errors here in case the user denies camera access
      } catch (error) {
        this.hasCameraSupport = false;
      }

      this.$refs.video.srcObject = stream;
    },
    async captureImg() {
      const { video } = this.$refs;
      const { canvas } = this.$refs;

      // Element.getBoundingClientRect() allows us to get some information about the element,
      // like width, height and its position relative to the viewport
      canvas.width = video.getBoundingClientRect().width;
      canvas.height = video.getBoundingClientRect().height;

      // Get a context from the canvas (we need to do this in order to get the image)
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      this.capturedImage = true;
      // canvas.toDataURL returns a base64/DataURL string, we need to convert
      // it to a blob to work with it more conveniently.
      this.post.photo = await this.dataURLToBlob(
        canvas.toDataURL('image/jpeg', 0.8)
      );
      this.disableCamera();
    },
    async dataURLToBlob(url) {
      const fetchedURL = await fetch(url);
      const blob = await fetchedURL.blob();
      return blob;
    },
    disableCamera() {
      this.$refs.video.srcObject.getVideoTracks().forEach((track) => {
        track.stop();
      });
    },
    uploadImgFile(file) {
      this.post.photo = file;
      const { canvas } = this.$refs;
      const context = canvas.getContext('2d');

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          this.capturedImage = true;
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    },
    getLocation() {
      this.loadingLocation = true;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.getCityAndCountry(position);
        },
        (err) => {
          this.locationError(err);
          this.loadingLocation = false;
        },
        { timeout: 7000 }
      );
    },
    async getCityAndCountry(position) {
      const apiUrl = `https://geocode.xyz/${position.coords.latitude},${position.coords.longitude}?geoit=json`;
      let res;
      try {
        res = await this.$axios.get(apiUrl);
        this.locationSuccess(res.data);
      } catch (err) {
        this.loadingLocation = false;
        this.locationError(err);
      }
    },
    locationSuccess(result) {
      this.loadingLocation = false;
      this.post.location = result.country
        ? `${result.city}, ${result.country}`
        : `${result.city}`;
    },
    locationError(err) {
      this.$q.dialog({
        title: 'Location error',
        message: "We couldn't get your location."
      });

      return err;
    },
    async addPost() {
      this.$q.loading.show({});
      const formData = new FormData();
      formData.append('caption', this.post.caption);
      formData.append('date', this.post.date);
      formData.append('location', this.post.location);
      formData.append('id', this.post.id);
      formData.append('file', this.post.photo, `${this.post.id}.png`);

      try {
        await this.$axios.post(`${process.env.API}/posts`, formData);
        this.$router.push('/');
        this.$q.notify({
          message: 'Post created succesfully!',
          timeout: 1000
        });
        this.$q.loading.hide({});
      } catch (error) {
        this.$q.dialog({
          title: 'Something went wrong!',
          message: 'Please try again later.'
        });
        this.$q.loading.hide({});
      }
    }
  },
  mounted() {
    this.initCamera();
  },
  beforeDestroy() {
    if (this.hasCameraSupport) {
      this.disableCamera();
    }
  }
};
</script>

<style lang="scss">
.camera-frame {
  border: solid 2px $grey-10;
  border-radius: 10px;
}
</style>
