<template>
  <div class="card">

    <div class="left-col">
      <img :src="user.picture" alt="Avatar" class="avatar" />
      <h2>{{ user.name.title }} {{ user.name.first }} {{ user.name.last }}</h2>
      
      <div class="badge" :class="getAgeCategoryClass(user.dob.age)">
        <span v-if="user.dob.age < 18">Неповнолітній</span>
        <span v-else-if="user.dob.age <= 35">Молодь</span>
        <span v-else-if="user.dob.age <= 60">Дорослий</span>
        <span v-else>Похилий вік</span>
      </div>

      <p>♀ {{ user.gender }} | 🎂 {{ user.dob.age }} років</p>
      <p>📍 {{ getLocationString(user.location) }}</p>
      <p>✉️ {{ user.email }}</p>
      <p>📞 {{ user.phone }}</p>
      <p>📱 {{ user.cell }}</p>
    </div>

    <div class="right-col">
      <div class="section">
        <h3>About me</h3>
        <button @click="showDetails = !showDetails">
          {{ showDetails ? 'Сховати' : 'Показати' }}
        </button>
        <p v-show="showDetails">{{ user.details || 'Немає опису' }}</p>
      </div>

      <div class="section">
        <h3>Personal Information</h3>
        <table>
          <tr>
            <td>Full name:</td>
            <td>{{ user.name.title }} {{ user.name.first }} {{ user.name.last }}</td>
          </tr>
          <tr>
            <td>Gender:</td>
            <td>{{ user.gender }}</td>
          </tr>
          <tr>
            <td>Date of birth:</td>
            <td>{{ formatDate(user.dob.date) }} (age {{ user.dob.age }})</td>
          </tr>
          <tr>
            <td>Email:</td>
            <td>{{ user.email }}</td>
          </tr>
          <tr>
            <td>Phone:</td>
            <td>{{ user.phone }}</td>
          </tr>
          <tr>
            <td>Cell:</td>
            <td>{{ user.cell }}</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <h3>Location</h3>
        <table v-if="typeof user.location === 'object'">
          <tr><td>Street:</td><td>{{ user.location.street?.number }} {{ user.location.street?.name }}</td></tr>
          <tr><td>City:</td><td>{{ user.location.city }}</td></tr>
          <tr><td>State:</td><td>{{ user.location.state }}</td></tr>
          <tr><td>Country:</td><td>{{ user.location.country }}</td></tr>
          <tr><td>Postcode:</td><td>{{ user.location.postcode }}</td></tr>
        </table>
      </div>

      <div class="section" v-if="user.hobbies">
        <h3>Hobbies</h3>
        <div class="hobbies">
          <span v-for="(hobby, i) in user.hobbies" :key="i" class="hobby-tag">
            {{ hobby }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { User } from '../types/user'
import usersData from '../data/users.json'

const users = ref<User[]>(usersData as User[])
const user = ref<User>(users.value[0])
const showDetails = ref<boolean>(true)

const getAgeCategoryClass = (age: number) => {
  if (age < 18) return 'cat-minor'
  if (age <= 35) return 'cat-youth'
  if (age <= 60) return 'cat-adult'
  return 'cat-senior'
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString()
}

const getLocationString = (loc: any) => {
  if (typeof loc === 'object') {
    return `${loc.city}, ${loc.state}, ${loc.country}`
  }
  return loc
}
</script>

<style scoped>
.card {
  display: flex;
  gap: 20px;
  width: 800px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fff;
  font-family: sans-serif;
  color: #333;
}

.left-col {
  width: 30%;
  border-right: 1px solid #eee;
  padding-right: 15px;
}

.right-col {
  width: 70%;
}

.avatar {
  width: 100%;
  border-radius: 8px;
}

.badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 10px;
}
.cat-minor { background: #fff3cd; }
.cat-youth { background: #d4edda; }
.cat-adult { background: #cce5ff; }
.cat-senior { background: #e2e3e5; }

.section {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.section h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

td {
  padding: 4px 0;
  font-size: 14px;
}

td:first-child {
  color: #666;
  width: 120px;
}

.hobbies {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.hobby-tag {
  background: #eef2ff;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 13px;
}

button {
  cursor: pointer;
  padding: 4px 8px;
  margin-bottom: 8px;
}
</style>