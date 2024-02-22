const c = console.log,
  d = document,
  $table = d.querySelector(".crud-table"),
  $form = d.querySelector(".crud-form"),
  $title = d.querySelector(".crud-title"),
  $template = d.getElementById("crud-template").content,
  $fragment = d.createDocumentFragment();

// Read - GET(select)
async function getAllVideogames() {
  try {
    let res = await fetch("http://localhost:5000/videojuegos"),
      json = await res.json();
    c(res, json);

    if (res.ok !== true)
      throw { status: res.status, statusText: res.statusText };

    // iterando sobre las propiedades del objeto json
    json.forEach((game) => {
      // accediendo a cada propiedad y valor del objeto json. Tomo como referencia el template y navego por su estructura del DOM.
      $template.querySelector(".name").textContent = game.nombre;
      $template.querySelector(".console").textContent = game.consola;
      $template.querySelector(".concluded").textContent = game.concluido;

      // al botón de editar y eliminar le vamos a poner data-attributes. Para que cuando pulse el botón editar, los datos pasen al formulario. Y al pulsar botón eliminar, se elimine por medio del id.
      $template.querySelector(".edit").dataset.id = game.id;
      $template.querySelector(".edit").dataset.name = game.nombre;
      $template.querySelector(".edit").dataset.console = game.consola;
      $template.querySelector(".edit").dataset.concluded = game.concluido;
      $template.querySelector(".delete").dataset.id = game.id;

      // clono el nodo(la estructura), nos sirve de referencia para los demás elementos. Y al fragmento le agrego el clon.
      let $clone = d.importNode($template, true);
      $fragment.appendChild($clone);
    });

    // al elemento en cuestión le agrego el fragmento, para hacer una sola incersión al DOM.
    $table.querySelector("tbody").append($fragment);
  } catch (err) {
    let message =
      err.statusText || "Ocurrió un error en la petición GET(SELECT)";
    $table.insertAdjacentHTML(
      "afterend",
      `<p><b>Error: ${err.status} ${message}</b></p>`
    );
  }
}

d.addEventListener("DOMContentLoaded", getAllVideogames());

d.addEventListener("submit", async (e) => {
  // desactivamos por defecto el comportamiento del formulario que es auto procesarse, para controlar el envio del formulario con ajax.
  if (e.target === $form) e.preventDefault();

  // tenemos un input oculto el cuál validaremos. Si el id tiene valor significa que vamos vamos hacer una edición(PUT). Si el id no tiene valor significa que haremos una inserción(POST)
  if (!e.target.id.value) {
    // Crate - POST(insert)
    try {
      // objeto de opciones que pasaremos junto con la petición json.
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          nombre: e.target.nombre.value,
          consola: e.target.consola.value,
          concluido: e.target.concluido.value,
        }),
      };

      res = await fetch("http://localhost:5000/videojuegos", options);
      json = await res.json();

      if (res.ok !== true)
        throw { status: res.status, statusText: res.statusText };

      // recarga la URL
      location.reload();
    } catch (err) {
      let message =
        err.statusText || "Ocurrió un error en la petición POST(insert)";
      $form.insertAdjacentHTML(
        "afterend",
        `<p><b>Error: ${err.status} ${message}</b></p>`
      );
    }
  } else {
    // Update - PUT(update)
    try {
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          nombre: e.target.nombre.value,
          consola: e.target.consola.value,
          concluido: e.target.concluido.value,
        }),
      };
      // la petición de la url la modificamos al btn de editar que presionamos.
      (res = await fetch(
        `http://localhost:5000/videojuegos/${e.target.id.value}`,
        options
      )),
        (json = res.json());

      if (res.ok !== true)
        throw { status: res.status, statusText: res.statusText };

      location.reload();
    } catch (err) {
      let message =
        err.statusText || "Ocurrió un error en la petición PUT(update)";
      $form.insertAdjacentHTML(
        "afterend",
        `<p><b>Error: ${err.status} ${message}</b></p>`
      );
    }
  }
});

d.addEventListener("click", async (e) => {
  // pasando información del btn-editar al formulario
  if (e.target.matches(".edit")) {
    $title.textContent = "Editar Videojuego";
    $form.nombre.value = e.target.dataset.name;
    $form.consola.value = e.target.dataset.console;
    $form.concluido.value = e.target.dataset.concluded;
    $form.id.value = e.target.dataset.id;
  }

  if (e.target.matches(".delete")) {
    let isDelete = confirm(
      `¿Estas seguro de eliminar el id ${e.target.dataset.id}`
    );

    if (isDelete) {
      // Delete - DELETE(delete)
      try {
        // Esta petición no necesita de un cuerpo, porque en el mismo endpoint estamos especificando que valor se va a eliminar.
        const options = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        };

        // la petición de la url la modificamos al btn de eliminar que presionamos. Recuerda que btn eliminar tiene dataAttributes porque cada btn tiene el id que queremos eliminar
        (res = await fetch(
          `http://localhost:5000/videojuegos/${e.target.dataset.id}`,
          options
        )),
          (json = res.json());

        if (res.ok !== true)
          throw { status: res.status, statusText: res.statusText };

        location.reload();
      } catch (err) {
        let message =
          err.statusText || "Ocurrió un error en la petición DEL(delete)";
        $form.insertAdjacentHTML(
          "afterend",
          `<p><b>Error: ${err.status} ${message}</b></p>`
        );
      }
    }
  }
});
