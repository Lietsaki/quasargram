<template>
  <q-page class="constrain q-pa-md">
    <div class="row q-col-gutter-x-md">
      <!-- By default, take 12 columns. On sizes larger than small, use 8 colums. -->
      <div class="col-12 col-sm-8">
        <template v-if="!loadingPosts && posts.length">
          <q-card
            class="card-post q-mb-md"
            flat
            bordered
            v-for="post in posts"
            :key="post.id"
          >
            <q-item>
              <q-item-section avatar class="post-title-spacing">
                <q-avatar size="3rem">
                  <img
                    class="object-cover"
                    src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/close-up-of-cat-wearing-sunglasses-while-sitting-royalty-free-image-1571755145.jpg"
                  />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-h6">mr.cat</q-item-label>
                <q-item-label caption>
                  {{ post.location }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-img
              :src="post.imageUrl"
              placeholder-src="https://www2.le.ac.uk/offices/press/think-leicester/images/grey-block/image"
            />

            <q-card-section class="post-caption">
              <div class="text-subtitle2">{{ post.caption }}</div>
              <div class="text-caption text-grey">
                {{ post.date | niceDate }}
              </div>
            </q-card-section>
          </q-card>
        </template>
        <template v-else-if="!loadingPosts && !posts.length">
          <h5 class="text-center text-grey">No posts yet</h5>
        </template>
        <template v-else>
          <div class="q-pa-md">
            <q-card flat bordered>
              <q-item>
                <q-item-section avatar>
                  <q-skeleton type="QAvatar" size="3rem" animation="fade" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>
                    <q-skeleton type="text" animation="fade" />
                  </q-item-label>
                  <q-item-label caption>
                    <q-skeleton type="text" animation="fade" />
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-skeleton height="200px" square animation="fade" />

              <q-card-section>
                <q-skeleton
                  type="text"
                  class="text-subtitle2"
                  animation="fade"
                />
                <q-skeleton
                  type="text"
                  width="50%"
                  class="text-subtitle2"
                  animation="fade"
                />
              </q-card-section>
            </q-card>
          </div>
        </template>
      </div>
      <div class="col-4 gt-xs">
        <q-item class="fixed">
          <q-item-section avatar class="post-title-spacing">
            <q-avatar size="4rem" class="q-mr-sm">
              <img
                class="object-cover"
                src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/close-up-of-cat-wearing-sunglasses-while-sitting-royalty-free-image-1571755145.jpg"
              />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-h6">mr.cat</q-item-label>
            <q-item-label caption>
              Mr. Cat
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </div>
  </q-page>
</template>

<script>
import { date } from 'quasar';

export default {
  name: 'PageHome',
  data() {
    return {
      posts: [],
      loadingPosts: true
    };
  },
  methods: {
    async getPosts() {
      try {
        this.loadingPosts = true;
        const res = await this.$axios.get(`${process.env.API}/posts`);
        this.posts = res.data;
        this.loadingPosts = false;
      } catch (error) {
        this.$q.dialog({
          title: 'Something went wrong!',
          message: 'Please try again later'
        });
        this.loadingPosts = false;
      }
    }
  },
  created() {
    this.getPosts();
  },
  filters: {
    niceDate(targetDate) {
      return date.formatDate(targetDate, 'MMM DD h:mmA');
    }
  }
};
</script>

<style lang="scss">
.card-post {
  min-height: 200px;
}
.post-caption {
  padding: 8px;
}
.post-title-spacing {
  padding: 0;
  min-width: 40px;
}
</style>
