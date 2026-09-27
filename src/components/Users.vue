<template>
  <div class="users-page">
    <h2>Список користувачів</h2>

    <div class="toolbar">
      <div class="filter-group">
        <span>Стать:</span>
        <button :class="{ active: genderFilter === 'all' }" @click="genderFilter = 'all'">Всі</button>
        <button :class="{ active: genderFilter === 'male' }" @click="genderFilter = 'male'">Чоловіки</button>
        <button :class="{ active: genderFilter === 'female' }" @click="genderFilter = 'female'">Жінки</button>
      </div>

      <div class="filter-group">
        <span>Вік:</span>
        <button :class="{ active: ageFilter === 'all' }" @click="ageFilter = 'all'">Всі</button>
        <button :class="{ active: ageFilter === '18+' }" @click="ageFilter = '18+'">18 +</button>
      </div>

      <div class="filter-group">
        <span>Сортування:</span>
        <button :class="{ active: sortBy === 'name-asc' }" @click="sortBy = 'name-asc'">Ім’я ↑</button>
        <button :class="{ active: sortBy === 'name-desc' }" @click="sortBy = 'name-desc'">Ім’я ↓</button>
        <button :class="{ active: sortBy === 'age-asc' }" @click="sortBy = 'age-asc'">Вік ↑</button>
        <button :class="{ active: sortBy === 'age-desc' }" @click="sortBy = 'age-desc'">Вік ↓</button>
      </div>

      <button class="reset-btn" @click="resetFilters">Очистити все</button>
    </div>

    <div v-if="filteredUsers.length === 0" class="empty-msg">
      Список юзерів пустий
    </div>

    <div v-else class="users-list">
      <div 
        v-for="user in filteredUsers" 
        :key="user.id"
        class="card" 
        :class="{
          'minor': user.dob.age < 18,
          'young': user.dob.age >= 18 && user.dob.age <= 30,
          'adult': user.dob.age >= 31 && user.dob.age <= 50,
          'senior': user.dob.age > 50
        }"
      >
        <div class="left-col">
          <img 
            :src="user.picture" 
            :alt="`${user.name.first} ${user.name.last}`" 
            class="avatar" 
          />
          <h2>{{ user.name.title }} {{ user.name.first }} {{ user.name.last }}</h2>

          <p v-if="user.dob.age > 18">
            🎂 {{ user.dob.age }} 
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
            <button @click="toggleDetails(user.id)">
              {{ detailsState[user.id] ? 'Сховати' : 'Показати' }}
            </button>
            <p v-show="detailsState[user.id]">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { User } from '../types/user'
import usersData from '../data/users.json'

const users = ref<User[]>(usersData as User[])

const genderFilter = ref<'all' | 'male' | 'female'>('all')
const ageFilter = ref<'all' | '18+'>('all')
const sortBy = ref<'none' | 'name-asc' | 'name-desc' | 'age-asc' | 'age-desc'>('none')

const detailsState = ref<Record<number, boolean>>({})

const toggleDetails = (id: number) => {
  detailsState.value[id] = !detailsState.value[id]
}

const resetFilters = () => {
  genderFilter.value = 'all'
  ageFilter.value = 'all'
  sortBy.value = 'none'
}

const filteredUsers = computed(() => {
  let result = [...users.value]

  if (genderFilter.value !== 'all') {
    result = result.filter(u => u.gender === genderFilter.value)
  }

  if (ageFilter.value === '18+') {
    result = result.filter(u => u.dob.age >= 18)
  }

  if (sortBy.value === 'name-asc') {
    result.sort((a, b) => a.name.first.localeCompare(b.name.first))
  } else if (sortBy.value === 'name-desc') {
    result.sort((a, b) => b.name.first.localeCompare(a.name.first))
  } else if (sortBy.value === 'age-asc') {
    result.sort((a, b) => a.dob.age - b.dob.age)
  } else if (sortBy.value === 'age-desc') {
    result.sort((a, b) => b.dob.age - a.dob.age)
  }

  return result
})

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
.users-page {
  max-width: 850px;
  margin: 0 auto;
  padding: 20px;
  font-family: sans-serif;
}

h2 {
  text-align: center;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  background: #f1f3f5;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  align-items: center;
  justify-content: space-between;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}

.filter-group span {
  font-weight: bold;
  margin-right: 4px;
}

.toolbar button {
  padding: 5px 10px;
  border: 1px solid #ccc;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.toolbar button.active {
  background: #007bff;
  color: white;
  border-color: #0056b3;
}

.reset-btn {
  background: #dc3545 !important;
  color: white !important;
  border-color: #bd2130 !important;
}

.empty-msg {
  text-align: center;
  padding: 4px 0;
  font-size: 18px;
  color: #888;
  margin-top: 30px;
}

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