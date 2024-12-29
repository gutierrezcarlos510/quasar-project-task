<template>
  <q-page class="flex flex-center">
    <div class="q-pa-xl q-ma-xl q-gutter-sm full-width">
      <q-table title="Categorias" :rows="dataProducts" :columns="columns" row-key="name" :filter="filter" binary-state-sort no-data-label="Sin datos registrados">
        <template v-slot:top>
          <div>
            <h4 class="q-py-none q-my-none">Categorías</h4>
            <div class="row full-width">
              <div class="">
                <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class=""><q-btn flat outline dense color="primary" label="Adicionar categoría" icon="add"  @click="mostrarModal" ></q-btn></div>
            </div>
          </div>
          <div class="q-pa-sm q-gutter-sm">
            <q-dialog v-model="confirm" persistent>
              <q-card>
                <q-card-section class="row items-center">
                  <q-avatar icon="delete" color="red" text-color="white" />
                  <span class="q-ml-sm">¿Está seguro de eliminar el producto?</span>
                </q-card-section>
                <q-card-section class="row items-center">
                  <div class="col-6"><strong>Id</strong></div>
                  <div class="col-6">{{ editedItem.id }}</div>
                  <div class="col-6"><strong>Nombre</strong></div>
                  <div class="col-6">{{ editedItem.nombre }}</div>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat label="Cancelar" color="primary" v-close-popup />
                  <q-btn flat label="Aceptar" @click="deleteItem(editedItem)" color="primary" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>
            <q-dialog v-model="show_dialog" >
              <q-card>
                <q-card-section class="row items-center q-pb-none">
                  <div class="text-h6">{{ labelModal }}</div>
                  <q-space />
                  <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>

                <q-card-section>
                  <div class="row q-col-gutter-md full-width q-pa-sm">
                    <div class="col-6">
                      <q-input type="number" v-model.number="editedItem.id" label="ID" readonly>
                        <template v-slot:prepend>
                          <q-icon name="remember_me" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col-12">
                      <q-input v-model="editedItem.nombre" label="Nombre" >
                        <template v-slot:prepend>
                          <q-icon name="radio" />
                        </template>
                      </q-input>
                    </div>
                  </div>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat label="Guardar" color="primary" v-close-popup @click="addRow" ></q-btn>
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="id" :props="props">
              {{ props.row.id }}
            </q-td>
            <q-td key="nombre" :props="props">
              {{ props.row.nombre }}
            </q-td>
            <q-td key="actions" :props="props">
              <q-btn color="blue" label="Editar" @click="editItem(props.row)" size=sm></q-btn>
              <q-btn color="red" label="Eliminar"  @click="modalEliminar(props.row)" size=sm></q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { Notify } from 'quasar'
import { useCategoriaStore } from 'stores/categoria-store.js'

const loading = ref(false);
const categoriaStore = useCategoriaStore();
const dataProducts = ref([]);

const confirm = ref(false);
const filter = ref("");
const show_dialog = ref(false);
const editedIndex = ref(-1);
const editedItem = ref({
    "id": 0,
    "nombre": ""
});
const defaultItem = ref({
  "id": 0,
  "nombre": ""
});
const columns= ref([
  {
    name: "id",
    required: true,
    label: "ID",
    align: "center",
    field: row => row.id,
    format: val => `${val}`,
    sortable: true,
    style: "width: 10px",
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
  },
  {
    name: "nombre",
    align: "center",
    label: "Nombre",
    field: "nombre",
    sortable: true
  },
  {
    name: "actions",
    label: "Acciones",
    field: "actions"
  }
]);
  const mostrarModal = () => {
    editedItem.value = Object.assign({}, defaultItem.value)
    editedIndex.value = -1
    show_dialog.value = true
  }
const addRow = async() => {
  if (editedIndex.value > -1) {
    editedItem.value.id = parseInt(editedItem.value.id);
    await categoriaStore.update(editedItem.value);
    dataProducts.value = await categoriaStore.listActive();
  } else {
    let maxId = 0;
    if(dataProducts.value.length > 0){
      maxId = Math.max.apply(Math, dataProducts.value.map(val => val.id));
    }
    maxId = maxId + 1;
    editedItem.value.id = maxId + "";
    const resp = await categoriaStore.save(editedItem.value);
    dataProducts.value = await categoriaStore.listActive();
    console.log(resp);
    // data.value.push(editedItem.value);
  }
  close()
};
const deleteItem = async(item) => {
  await categoriaStore.remove(item.id);
  Notify.create({
    type: 'negative',
    message: 'Categoria eliminado exitosamente.'
  });
  dataProducts.value = await categoriaStore.listActive();
};
const editItem = (item) => {
  editedIndex.value = dataProducts.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  show_dialog.value = true;
};
const modalEliminar = (item) => {
  editedIndex.value = dataProducts.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  confirm.value = true;
};
const close = () => {
  show_dialog.value = false
  setTimeout(() => {
    editedItem.value = Object.assign({}, defaultItem.value)
    editedIndex.value = -1
  }, 300)
}
const labelModal = computed(() => {
  return editedIndex.value === -1 ? "Registrar" : "Actualizar";
});
// function  mounted
onMounted(async() => {
  loading.value = true;
  dataProducts.value = await categoriaStore.listActive();
  loading.value = false;
});
</script>
