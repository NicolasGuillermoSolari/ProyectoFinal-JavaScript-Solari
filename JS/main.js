// CLASES

class Propiedad {
  constructor(direccion, precio, stock) {
    this.direccion = direccion;
    this.precio = precio;
    this.stock = stock;
  }
  descontarStock() {
    this.stock--;
  }
}

class PropiedadCarrito {
  constructor(direccion, precio, cantidad = 1) {
    this.direccion = direccion;
    this.precio = precio;
    this.cantidad = cantidad;
  }

  sumarCantidad() {
    this.cantidad++;
  }
}

//FUNCIONES

function calcularTotal() {
  let total = 0;

  total = carrito.reduce((acumulador, propiedadCarrito) => {
    return acumulador + propiedadCarrito.cantidad * propiedadCarrito.precio;
  }, 0);

  // Seteo el total al span
  spanTotal.innerHTML = `$${total}`;
}

function eliminarPropiedad(propiedadAEliminar) {
  // Busca si hay propiedades en el carrito
  const indicePropiedadEncontrado = carrito.findIndex(
    (propiedadCarrito) =>
      propiedadCarrito.direccion === propiedadAEliminar.direccion
  );

  if (indicePropiedadEncontrado !== -1) {
    // Eliminamos la propiedad
    carrito.splice(indicePropiedadEncontrado, 1);
  }
  renderizarCarrito();
}

function renderizarCarrito() {
  // Limpio la tabla
  tbodyCarrito.innerHTML = "";

  for (const propiedadCarrito of carrito) {
    // tr de la tabla
    const tr = document.createElement("tr");

    const tdDireccion = document.createElement("td");
    tdDireccion.innerText = `${propiedadCarrito.direccion}`;

    const tdPrecio = document.createElement("td");
    tdPrecio.innerText = `$${propiedadCarrito.precio}`;

    const tdCantidad = document.createElement("td");
    tdCantidad.innerText = `${propiedadCarrito.cantidad}`;

    const tdAcciones = document.createElement("td");
    const btnEliminarPropiedad = document.createElement("button");
    btnEliminarPropiedad.innerText = "Eliminar";

    // Creamos el evento cuando se quiera eliminar un producto
    btnEliminarPropiedad.addEventListener("click", () => {
      eliminarPropiedad(propiedadCarrito);
    });

    tdAcciones.append(btnEliminarPropiedad);

    // Agrego los td al tr
    tr.append(tdDireccion, tdPrecio, tdCantidad, tdAcciones);

    // Agrego el tr al tbody
    tbodyCarrito.append(tr);
  }

  // Calcular total
  calcularTotal();
}

function propiedadTieneStock(propiedadAAgregar) {
  return propiedadAAgregar.stock >= 1;
}

function agregarPropiedadAlCarrito(propiedadAAgregar) {
  // Buscamos si existe el producto en el carrito
  const indicePropiedadEncontrado = carrito.findIndex(
    (propiedadCarrito) =>
      propiedadCarrito.direccion === propiedadAAgregar.direccion
  );

  // Si no existe, lo agregamos
  if (indicePropiedadEncontrado === -1) {
    // Agrego el producto al carrito
    carrito.push(
      new PropiedadCarrito(
        propiedadAAgregar.direccion,
        propiedadAAgregar.precio
      )
    );

    // Descuento stock del producto
    propiedadAAgregar.descontarStock();
  } else {
    // Si el producto existe en el carrito

    // Chequeamos si el producto tiene stock
    if (propiedadTieneStock(propiedadAAgregar)) {
      // Le sumo uno a la cantidad
      carrito[indicePropiedadEncontrado].sumarCantidad();

      // Descuento stock del producto
      propiedadAAgregar.descontarStock();
    } else {
      Swal.fire({
        icon: "error",
        title: "No hay cupo",
        text: "No hay más semanas disponibles",
      });
    }
  }

  // Renderizo el carrito
  renderizarCarrito();
  renderizarListaDePropiedades(propiedades);
}

function renderizarListaDePropiedades() {
  // Limpiar la lista de productos
  divListaDePropiedades.innerHTML = "";

  // Recorro la lista de productos
  for (const propiedadDeLista of propiedades) {
    // Crear div del producto
    const div = document.createElement("div");

    // Creo el título del producto
    const direccion = document.createElement("h3");
    direccion.innerText = propiedadDeLista.direccion;

    // Creo el precio
    const precio = document.createElement("h4");
    precio.innerText = `U$s${propiedadDeLista.precio}`;

    // Creo el stock
    const stock = document.createElement("h4");
    stock.innerText = `Semanas: ${propiedadDeLista.stock}`;

    // Creo el botón
    const btnAgregarAlCarrito = document.createElement("button");
    btnAgregarAlCarrito.innerText = "Agregar al carrito";

    // Creo el evento para agregar el producto al carrito
    btnAgregarAlCarrito.addEventListener("click", () => {
      // Agregar producto al carrito
      agregarPropiedadAlCarrito(propiedadDeLista);
    });

    // Agrego al div todos los elementos
    div.append(direccion, precio, stock, btnAgregarAlCarrito);

    // Agrego el div a la lista
    divListaDePropiedades.append(div);
  }
}

//traigo del JSON los productos para usarlos como objetos
function obtenerPropiedadesDelJSON() {
  fetch("/propiedades.json")
    .then((response) => {
      return response.json();
    })
    .then((propiedadesJSON) => {
      for (const propiedadJSON of propiedadesJSON) {
        propiedades.push(
          new Propiedad(
            propiedadJSON.direccion,
            propiedadJSON.precio,
            propiedadJSON.stock
          )
        );
      }

      renderizarListaDePropiedades();
    });
}
// INICIO DEL PROGRAMA

const divListaDePropiedades = document.getElementById("listaDePropiedades");
const tbodyCarrito = document.getElementById("tbodyCarrito");
const spanTotal = document.getElementById("total");
let propiedades = [];
let carrito = [];

obtenerPropiedadesDelJSON();
