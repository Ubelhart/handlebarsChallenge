const express = require("express");
const app = express();
const router = express.Router();
const handlebars = require("express-handlebars");

const PORT = 8080;

class ApiProducts {
  constructor() {
    this.products = [
      {
        title: "Escuadra",
        price: 123.45,
        thumbnail:
          "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
        id: 1,
      },
      {
        title: "Calculadora",
        price: 234.56,
        thumbnail:
          "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png",
        id: 2,
      },
      {
        title: "Globo Terráqueo",
        price: 345.67,
        thumbnail:
          "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png",
        id: 3,
      },
    ];

    router.use(express.json());
    router.use(express.urlencoded({ extended: true }));

    this.showProducts();
    this.showProduct();
  }

  showProducts() {
    const products = this.products;
    router
      .route("/")
      .get((req, res) => {
        res.render("table", { products });
      })
      .post((req, res) => {
        const newProduct = req.body;
        newProduct.price = parseInt(newProduct.price);

        if (!this.products.length) {
          newProduct.id = 1;
        } else {
          newProduct.id = this.products.at(-1).id + 1;
        }

        this.products.push(newProduct);
        res.render("table", { products });
      });
  }

  showProduct() {
    router
      .route("/:id")
      .get((req, res) => {
        const product = this.products.find(
          (product) => product.id == req.params.id
        );

        if (product) {
          res.json(product);
        } else {
          res.json({ error: "producto no encontrado" });
        }
      })
      .put((req, res) => {
        const product = this.products.find(
          (product) => product.id == req.params.id
        );

        if (product) {
          this.products = this.products.filter(
            (product) => product.id != req.params.id
          );

          this.products.push(req.body);
          console.log(this.products);
          res.json(
            `El producto con el id:${req.params.id} ha sido actualizado`
          );
        } else {
          res.json({ error: "producto no encontrado" });
        }
      })
      .delete((req, res) => {
        const product = this.products.find(
          (product) => product.id == req.params.id
        );
        if (product) {
          this.products = this.products.filter(
            (product) => product.id != req.params.id
          );

          console.log(this.products);

          res.json(`El producto con el id:${req.params.id} ha sido eliminado`);
        } else {
          res.json({ error: "producto no encontrado" });
        }
      });
  }
}

class App {
  constructor() {
    new ApiProducts();

    app.use("/static", express.static(__dirname + "/public"));
    app.use("/api/productos", router);

    app.set("views", "./views");
    // Cambiar hbs a pug o ejs o viceversa para probar otros motores de platilla
    app.set("view engine", "hbs");

    this.handlebarsEngine();
    this.showForm();
  }

  // Metodo para handlebars, borrar si usas pug o ejs.
  handlebarsEngine() {
    app.engine(
      "hbs",
      handlebars.engine({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: __dirname + "/views/layouts",
        partialsDir: __dirname + "/views/partials",
      })
    );
  }

  showForm() {
    app.get("/", (req, res) => {
      res.render("form");
    });
  }

  startServer(port) {
    const server = app.listen(port, () => {
      console.log(
        `Servidor http escuchando en el puerto ${server.address().port}`
      );
    });
  }
}

new App().startServer(PORT);
