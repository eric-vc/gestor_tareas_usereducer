import { useReducer, useEffect } from 'react';
const initialState = {
  tareas: [],
  filtro: 'todas'
};
function tareaReducer(estado, accion) {
  switch(accion.type) {
    case 'CARGAR_TAREAS':
      return { ...estado, tareas: accion.payload };
    
    case 'AGREGAR_TAREA':
      return {
        ...estado,
        tareas: [...estado.tareas, {
          id: Date.now(),
          texto: accion.payload,
          completada: false,
          creada: new Date()
        }]
      };
    
    case 'ELIMINAR_TAREA':
      return {
        ...estado,
        tareas: estado.tareas.filter(t => t.id !== 
accion.payload)
      };
    
    case 'COMPLETAR_TAREA':
      return {
        ...estado,
        tareas: estado.tareas.map(t =>
          t.id === accion.payload
            ? { ...t, completada: !t.completada }
            : t
        )
      };
    
    case 'EDITAR_TAREA':
      return {
        ...estado,
        tareas: estado.tareas.map(t =>
          t.id === accion.payload.id
            ? { ...t, texto: accion.payload.texto }
            : t
        )
      };
    
    case 'ESTABLECER_FILTRO':
      return { ...estado, filtro: accion.payload };
    
    case 'VACIAR_COMPLETADAS':
      return {
        ...estado,
        tareas: estado.tareas.filter(t => !t.completada)
      };
    
    default:
      return estado;
  }
}
export function useTaskReducer() {
  const [estado, dispatch] = useReducer(tareaReducer, 
initialState);
  // Cargar del localStorage al montar
  useEffect(() => {
    const guardadas = localStorage.getItem('tareas');
    if (guardadas) {
      dispatch({
        type: 'CARGAR_TAREAS',
        payload: JSON.parse(guardadas)
      });
    }
  }, []);
  // Guardar en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('tareas', 
JSON.stringify(estado.tareas));
  }, [estado.tareas]);
  const tareasFiltradas = estado.tareas.filter(t => {
    if (estado.filtro === 'completadas') return t.completada;
    if (estado.filtro === 'pendientes') return !t.completada;
    return true;
  });
  return {
    tareas: tareasFiltradas,
    dispatch,
    filtro: estado.filtro,
    totalTareas: estado.tareas.length,
    completadas: estado.tareas.filter(t => t.completada).length,
    pendientes: estado.tareas.filter(t => !t.completada).length
  };
}