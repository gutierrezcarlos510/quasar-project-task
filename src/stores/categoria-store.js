import { defineStore } from "pinia";
import { api } from "src/boot/axios";
// import { alertGlobal }  from "src/composables/alert";
// import { utilTable } from "src/composables/table-pagination";
// import { ref } from "vue";

export const useCategoriaStore = defineStore("categoria", () => {
    // const { alertException } = alertGlobal();

    const listActive = async () => {
      const resp = await api({
        method: 'GET',
        url: "/categorias",
      });
      return resp.data;
    }
  const findById = async (productoId) => {
    return await api({
      method: 'GET',
      url: `/categorias/${productoId}`,
    });
  }

  const save = async (objJson) => {
    const resp = await api({
      method: "POST",
      url: "/categorias",
      data: objJson
    });
    return resp.data;
  };
  const update = async (objJson) => {
    return await api({
      method: "PUT",
      url: `/categorias/${objJson.id}`,
      data: objJson,
      headers: {
        "Content-Type": "application/json"
      }
    })
  };
  const remove = async (productoId) => {
    return await api({
      method: "DELETE",
      url: `/categorias/${productoId}`
    });
  };
    return {
      listActive,
      findById,
      save,
      update,
      remove
    }
})
