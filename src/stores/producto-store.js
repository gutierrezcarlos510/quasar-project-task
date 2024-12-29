import { defineStore } from "pinia";
import { api } from "src/boot/axios";
// import { alertGlobal }  from "src/composables/alert";
// import { utilTable } from "src/composables/table-pagination";
// import { ref } from "vue";

export const useProductoStore = defineStore("producto", () => {
    // const { alertException } = alertGlobal();

    const listActive = async (moreThanSize) => {
      const resp = await api({
        method: 'GET',
        url: "/productos",
      });
      const datos = resp.data;
      if(moreThanSize > -1) {
        return datos.filter(producto => producto.cantidad > moreThanSize);
      } else {
        return datos;
      }
    }
  const findById = async (productoId) => {
    return await api({
      method: 'GET',
      url: `/productos/${productoId}`,
    });
  }

  const save = async (objJson) => {
    const resp = await api({
      method: "POST",
      url: "/productos",
      data: objJson
    });
    return resp.data;
  };
  const update = async (objJson) => {
    return await api({
      method: "PUT",
      url: `/productos/${objJson.id}`,
      data: objJson,
      headers: {
        "Content-Type": "application/json"
      }
    })
  };
  const remove = async (productoId) => {
    return await api({
      method: "DELETE",
      url: `/productos/${productoId}`
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
