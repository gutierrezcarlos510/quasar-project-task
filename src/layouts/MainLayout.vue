<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Venta de electronicos: "EL CHAPACO"
        </q-toolbar-title>

        <div>Gestion 2025</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Menú
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Productos',
    caption: 'Radios, tvs, etc.',
    icon: 'inventory',
    link: 'productos'
  },
  {
    title: 'Categorias',
    caption: 'Clasificacion de productos',
    icon: 'category',
    link: 'categorias'
  },
  {
    title: 'Ventas',
    caption: 'Transacciones comerciales',
    icon: 'shopping_cart',
    link: 'ventas'
  }
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
