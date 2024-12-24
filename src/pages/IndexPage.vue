<template>
  <q-page class="flex flex-center">
    <div class="q-pa-xl q-ma-lg-xl q-gutter-sm full-width">
      <q-table title="Agenda de contactos" :rows="data" :columns="columns" row-key="name" :filter="filter" binary-state-sort no-data-label="Sin datos registrados">
        <template v-slot:top>
          <div>
            <h4 class="q-py-none q-my-none">Agenda de contactos</h4>
            <div class="row full-width">
              <div class="">
                <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class=""><q-btn flat outline dense color="primary" label="Adicionar contacto" icon="add"  @click="mostrarModal" ></q-btn></div>
            </div>
          </div>
          <div class="q-pa-sm q-gutter-sm">
            <q-dialog v-model="confirm" persistent>
              <q-card>
                <q-card-section class="row items-center">
                  <q-avatar icon="delete" color="red" text-color="white" />
                  <span class="q-ml-sm">¿Está seguro de eliminar el contacto?</span>
                </q-card-section>
                <q-card-section class="row items-center">
                  <div class="col-6"><strong>Id</strong></div>
                  <div class="col-6">{{ editedItem.id }}</div>
                  <div class="col-6"><strong>Nombre</strong></div>
                  <div class="col-6">{{ editedItem.name }}</div>
                  <div class="col-6"><strong>Email</strong></div>
                  <div class="col-6">{{ editedItem.email }}</div>
                  <div class="col-6"><strong>Dirección</strong></div>
                  <div class="col-6">{{ editedItem.address }}</div>
                  <div class="col-6"><strong>Telefono</strong></div>
                  <div class="col-6">{{ editedItem.phone }}</div>
                  <div class="col-6"><strong>Pais</strong></div>
                  <div class="col-6">{{ editedItem.country }}</div>
                  <div class="col-6"><strong>Ciudad</strong></div>
                  <div class="col-6">{{ editedItem.city }}</div>
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
                      <q-input v-model="editedItem.id" label="ID" readonly>
                        <template v-slot:prepend>
                          <q-icon name="remember_me" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col-6">
                      <q-input v-model="editedItem.name" label="Nombre" >
                        <template v-slot:prepend>
                          <q-icon name="person" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col-6">
                      <q-input v-model="editedItem.email" label="Correo electrónico">
                        <template v-slot:prepend>
                          <q-icon name="mail" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col-6">
                      <q-input v-model="editedItem.address" label="Dirección">
                        <template v-slot:prepend>
                          <q-icon name="import_contacts" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col-6">
                      <q-input v-model="editedItem.phone" label="Teléfono">
                        <template v-slot:prepend>
                          <q-icon name="call" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col-6">
                      <q-input v-model="editedItem.country" label="Pais">
                        <template v-slot:prepend>
                          <q-icon name="flag" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col-6">
                      <q-input v-model="editedItem.city" label="Ciudad">
                        <template v-slot:prepend>
                          <q-icon name="location_city" />
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
              <q-popup-edit v-model="props.row.id">
                <q-input type="number" v-model="props.row.id" dense autofocus counter ></q-input>
              </q-popup-edit>
            </q-td>
            <q-td key="name" :props="props">
              {{ props.row.name }}
              <q-popup-edit v-model="props.row.name" title="Actualizar nombre" buttons >
                <q-input type="text" v-model="props.row.name" dense autofocus ></q-input>
              </q-popup-edit>
            </q-td>
            <q-td key="email" :props="props">
              <div class="text-pre-wrap">{{ props.row.email }}</div>
              <q-popup-edit v-model="props.row.email">
                <q-input type="text" v-model="props.row.email" dense autofocus ></q-input>
              </q-popup-edit>
            </q-td>
            <q-td key="address" :props="props">
              {{ props.row.address }}
              <q-popup-edit v-model="props.row.address" title="Actualizar direccion" buttons persistent>
                <q-input type="text" v-model="props.row.address" dense autofocus hint="Use buttons to close" ></q-input>
              </q-popup-edit>
            </q-td>
            <q-td key="phone" :props="props">{{ props.row.phone }}</q-td>
            <q-td key="country" :props="props">{{ props.row.country }}</q-td>
            <q-td key="city" :props="props">{{ props.row.city }}</q-td>
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
import { computed, ref } from 'vue'
import { Notify } from 'quasar'

const confirm = ref(false);
const filter = ref("");
const show_dialog = ref(false);
const editedIndex = ref(-1);
const editedItem = ref({
    id: 0,
    name: "",
    email: "",
    address: "",
    phone: "",
    country: "",
    city: ""
});
const defaultItem = ref({
  id: 0,
  name: "",
  email: "",
  address: "",
  phone: "",
  country: "",
  city: ""
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
    name: "name",
    align: "center",
    label: "Nombre",
    field: "name",
    sortable: true
  },
  {
    name: "email",
    label: "Email",
    field: "email",
    sortable: true
  },
  { name: "address", label: "Dirección", field: "address" },
  { name: "phone", label: "Teléfono", field: "phone" },
  { name: "country", label: "País", field: "country" },
  {
    name: "city",
    label: "Ciudad",
    field: "city",
    sortable: false
  },
  {
    name: "actions",
    label: "Acciones",
    field: "actions"
  }
]);
  const data = ref([]);
  const mostrarModal = () => {
    editedItem.value = Object.assign({}, defaultItem.value)
    editedIndex.value = -1
    show_dialog.value = true
  }
const addRow = () => {
  if (editedIndex.value > -1) {
    Object.assign(data.value[editedIndex.value], editedItem.value);
  } else {
    let maxId = 0;
    if(data.value.length > 0){
      maxId = Math.max.apply(Math, data.value.map(val => val.id));
    }
    maxId = maxId + 1;
    editedItem.value.id = maxId;
    data.value.push(editedItem.value);
  }
  close()
};
const deleteItem = (item) => {
  data.value = data.value.filter(it => it.id !== item.id);
  Notify.create({
    type: 'negative',
    message: 'Contacto eliminado exitosamente.'
  })
};
const editItem = (item) => {
  editedIndex.value = data.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  show_dialog.value = true;
};
const modalEliminar = (item) => {
  editedIndex.value = data.value.indexOf(item);
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
</script>
