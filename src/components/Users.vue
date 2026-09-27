<template>
  <div 
    class="card" 
    :class="{
      'minor': user.dob.age < 18,
      'young': user.dob.age >= 18 && user.dob.age <= 30,
      'adult': user.dob.age >= 31 && user.dob.age <= 50,
      'senior': user.dob.age > 50
    }"
  >
    <div class="left-col">
      <img :src="user.picture" alt="Avatar" class="avatar" />
      <h2>{{ user.name.title }} {{ user.name.first }} {{ user.name.last }}</h2>

      <p v-if="user.dob.age > 18">
        🎂 Вік: {{ user.dob.age }} років
      </p>

      <p>♀ {{ user.gender }}</p>
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
        <p v-show="showDetails">
          {{ user.details || 'Інформація відсутня' }}
        </p>
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
          <tr v-if="user.dob.age > 18">
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

      <div class="section" v-if="user.hobbies && user.hobbies.length">
        <h3>Hobbies</h3>
        <ul class="hobbies-list">
          <li v-for="(hobby, index) in user.hobbies" :key="index">
            {{ hobby }}
          </li>
        </ul>
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
  border-radius: 8px;
  font-family: sans-serif;
  color: #333;
  border: 3px solid #ccc; 
}

.minor {
  border-color: #ffc107;
  background-color: #fffdf5;
}

.young {
  border-color: #28a745;
  background-color: #f6fff8;
}

.adult {
  border-color: #17a2b8;
  background-color: #f0fbff;
}

.senior {
  border-color: #6c757d;
  background-color: #f8f9fa;
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

.hobbies-list {
  margin: 0;
  padding-left: 20px;
}

.hobbies-list li {
  margin-bottom: 4px;
}

button {
  cursor: pointer;
  padding: 4px 8px;
  margin-bottom: 8px;
}
</style>