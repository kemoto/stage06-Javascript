class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`

    return fetch(endpoint)
      .then(data => data.json())
      .then(({login, name, public_repos, followers}) => ({
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
    this.entries = [
      {
        login: "kemoto",
        name: "Vitor Tominaga",
        repositories: "123",
        followers: "1234",
      },
      {
        login: "aaa",
        name: "Vitora",
        repositories: "1234",
        followers: "12346",
      },
    ];
  }

  removeFavorite(user) {
    this.entries = this.entries.filter(entry => { //O filter cria um novo array somente com os valores que deram true
      if(entry.login == user.login) {
        return false; //Retornando false a entrada que bate com a confirmação não entra no novo array filtrado
      } else {
        return true;
      }
    })

    this.update();
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.update();

    GithubUser.search('kemoto').then(user => console.log(user));
    
  }

  update() {
    this.removeAllTr();

    this.entries.forEach(entry => {
      const row = this.createRow();

      row.querySelector(".user img").src = `https://github.com/${entry.login}.png`;
      row.querySelector(".user img").alt = `Imagem de ${entry.name}`;
      row.querySelector(".user a").href = `https://github.com/${entry.login}`;
      row.querySelector(".user p").textContent = `${entry.name}`;
      row.querySelector(".user span").textContent = `/${entry.login}`;
      row.querySelector(".repositories").textContent = `${entry.repositories}`;
      row.querySelector(".followers").textContent = `${entry.followers}`;

      row.querySelector("td button").onclick = () => {
        const isOk = confirm("Deseja deletar essa linha?");

        if(isOk) {
          this.removeFavorite(entry);
        }
      }

      this.tbody.append(row)
    })
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
}
