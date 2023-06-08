class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`;

    return fetch(endpoint)
      .then((data) => data.json())
      .then(({ login, name, public_repos, followers }) => ({
        login,
        name,
        public_repos,
        followers,
      }));
  }
}

class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);

    this.tbody = document.querySelector("table .notEmpty");

    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites")) || [];
  }

  save() {
    localStorage.setItem("@github-favorites", JSON.stringify(this.entries));
  }

  async add(username) {
    try {
      const userExists = this.entries.find(
        (entry) => entry.login == username
      );

      if (userExists) {
        throw new Error("Usuário já cadastrado!");
      }

      const user = await GithubUser.search(username);

      if (user.login == undefined) {
        throw new Error("Usuário não encontrado!");
      }

      this.entries = [user, ...this.entries];
      this.save();
      this.update();
    } catch (e) {
      alert(e.message);
    }
  }

  removeFavorite(user) {
    this.entries = this.entries.filter((entry) => {
      //O filter cria um novo array somente com os valores que deram true
      if (entry.login == user.login) {
        return false; //Retornando false a entrada que bate com a confirmação não entra no novo array filtrado
      } else {
        return true;
      }
    });

    this.save();

    this.update();
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.update();

    this.onAdd();
  }

  onAdd() {
    const addButton = this.root.querySelector(".search button");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");

      this.add(value);
    };
  }

  update() {
    this.removeAllTr();

    this.entries.forEach((entry) => {
      const row = this.createRow();

      row.querySelector(
        ".user img"
      ).src = `https://github.com/${entry.login}.png`;
      row.querySelector(".user img").alt = `Imagem de ${entry.name}`;
      row.querySelector(".user a").href = `https://github.com/${entry.login}`;
      row.querySelector(".user p").textContent = `${entry.name}`;
      row.querySelector(".user span").textContent = `/${entry.login}`;
      row.querySelector(".repositories").textContent = `${entry.public_repos}`;
      row.querySelector(".followers").textContent = `${entry.followers}`;

      row.querySelector("td button").onclick = () => {
        const isOk = confirm("Deseja deletar essa linha?");

        if (isOk) {
          this.removeFavorite(entry);
        }
      };

      this.tbody.append(row);
    });

    this.updateEmptyTable();
  }

  createRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td class="user">
          <div class="userWrapper">
            <img src="" alt="" />
            <a href="" target="_blank">
              <p></p>
              <span>/kemoto</span>
            </a>
          </div>
        </td>
        <td class="repositories">123</td>
        <td class="followers">1234</td>
        <td>
          <button>Remover</button>
        </td>
    `;

    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }

  updateEmptyTable() { 
    if(this.entries.length !== 0) {
      document.querySelector(".empty").classList.add("hide");
      document.querySelector(".notEmpty").classList.remove("hide");
    } else {
      document.querySelector(".empty").classList.remove("hide");
      document.querySelector(".notEmpty").classList.add("hide");
    }
  }
}


