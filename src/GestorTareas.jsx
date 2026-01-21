import { useState } from 'react';
import { useTaskReducer } from './useTaskReducer';
import './GestorTareas.css';
export function GestorTareas() {
  const { tareas, dispatch, filtro, totalTareas, completadas, 
pendientes } = useTaskReducer();
  const [inputValue, setInputValue] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [editTexto, setEditTexto] = useState('');
  const agregarTarea = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      dispatch({ type: 'AGREGAR_TAREA', payload: inputValue });
      setInputValue('');
    }
  };
  const editarTarea = (id, nuevoTexto) => {
    dispatch({
      type: 'EDITAR_TAREA',
      payload: { id, texto: nuevoTexto }
    });
    setEditandoId(null);
  };
  return (
    <div className="gestor-tareas">
      <h1> Gestor de Tareas</h1>
      <div className="estadisticas">
        <div className="stat">
          <span className="numero">{totalTareas}</span>
          <span className="etiqueta">Total</span>
        </div>
        <div className="stat">
          <span className="numero">{pendientes}</span>
          <span className="etiqueta">Pendientes</span>
        </div>
        <div className="stat">
          <span className="numero">{completadas}</span>
          <span className="etiqueta">Completadas</span>
        </div>
      </div>
      <form onSubmit={agregarTarea} className="agregar-tarea">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Agregar nueva tarea..."
          className="input-tarea"
        />
        <button type="submit" className="btn
agregar">Agregar</button>
      </form>
      <div className="filtros">
        {['todas', 'pendientes', 'completadas'].map(f => (
          <button
            key={f}
            className={`filtro ${filtro === f ? 'activo' : ''}`}
            onClick={() => dispatch({ type: 'ESTABLECER_FILTRO', 
payload: f })}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div className="lista-tareas">
        {tareas.length === 0 ? (
          <p className="sin-tareas">No hay tareas</p>
        ) : (
          tareas.map(tarea => (
            <div key={tarea.id} className="tarea-item">
              <input
                type="checkbox"
                checked={tarea.completada}
                onChange={() => dispatch({
                  type: 'COMPLETAR_TAREA',
                  payload: tarea.id
                })}
                className="checkbox"
              />
              {editandoId === tarea.id ? (
                <input
                  type="text"
                  value={editTexto}
                  onChange={(e) => setEditTexto(e.target.value)}
                  onBlur={() => editarTarea(tarea.id, editTexto)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      editarTarea(tarea.id, editTexto);
                    }
                  }}
                  autoFocus
                  className="input-editar"
                />
              ) : (
                <span
                  className={`texto ${tarea.completada ? 
'completada' : ''}`}
                  onDoubleClick={() => {
                    setEditandoId(tarea.id);
                    setEditTexto(tarea.texto);
                  }}
                >
                  {tarea.texto}
                </span>
              )}
              <button
                className="btn-eliminar"
                onClick={() => dispatch({
                  type: 'ELIMINAR_TAREA',
                  payload: tarea.id
                })}
              >
                ✕
              </button>
</div>
))
)}
</div>
{completadas > 0 && (
<button
className="btn-limpiar"
onClick={() => dispatch({ type: 'VACIAR_COMPLETADAS' 
})}
>
Limpiar Completadas
</button>
)}
</div>
    );
}
export default GestorTareas;