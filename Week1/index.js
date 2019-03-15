"use strict";

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "json";
    xhr.onload = () => {
      if (xhr.status < 400) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error("Network request failed"));
    xhr.send();
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach(key => {
      const value = options[key];
      if (key === "text") {
        elem.innerText = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById("root");
      if (err) {
        createAndAppend("div", root, {
          text: err.message,
          class: "alert-error"
        });
      } else {
        // createAndAppend("pre", root, { text: JSON.stringify(data, null, 2) });
        createAndAppend("header", root, { id: "divHead", class: "header" });
        createAndAppend("p", divHead, { text: "HYF Repositories" });
        createAndAppend("select", divHead, {
          id: "selectElem",
          class: "repo-selector"
        });
        createAndAppend("div", root, { id: "container" });

        createOptions(data);
        displayInformation(data[0]);
        contributorsList(data[0]);

        document.getElementById("selectElem").onchange = function() {
          let selectedItemIndex = this.options[this.selectedIndex].value;
          let infoDiv = document.getElementById("divLeft");
          infoDiv.parentNode.removeChild(infoDiv);
          let contributors = document.getElementById("divRight");
          contributors.parentNode.removeChild(contributors);

          displayInformation(data[selectedItemIndex]);
          contributorsList(data[selectedItemIndex]);
        }; //listener
      }
    });
  }

  const HYF_REPOS_URL =
    "https://api.github.com/orgs/HackYourFuture/repos?per_page=100";

  window.onload = () => main(HYF_REPOS_URL);

  //Header
  function createOptions(wholeData) {
    for (let i = 0; i < wholeData.length; i++) {
      createAndAppend("option", selectElem, {
        value: i,
        text: wholeData[i].name,
        class: "optionsClass"
      });
    }
  }

  //Contributors
  function contributorsList(element) {
    fetchJSON(element.contributors_url, (err, data) => {
      createAndAppend("div", container, {
        id: "divRight",
        class: "right-div whiteframe"
      });
      createAndAppend("p", divRight, {
        text: "Contributions",
        class: "contributor-header"
      });
      createAndAppend("ul", divRight, {
        id: "contList",
        class: "contributor-list"
      });
      let link;
      let listItem;
      let contDataDiv;
      for (let i = 0; i < data.length; i++) {
        link = createAndAppend("a", contList, {
          href: data[i].html_url,
          target: "_blank"
        });
        listItem = createAndAppend("li", link, {
          class: "contributor-item"
        });

        createAndAppend("img", listItem, {
          src: data[i].avatar_url,
          class: "contributor-avatar"
        });
        contDataDiv = createAndAppend("div", listItem, {
          class: "contributor-data"
        });
        createAndAppend("div", contDataDiv, { text: data[i].login });
        createAndAppend("div", contDataDiv, {
          text: data[i].contributions,
          class: "contributor-badge"
        });

        /*createLi(data[i]);
        function createLi(dataIndex) {
          createAndAppend("img", listItem, {
            src: dataIndex.avatar_url,
            class: "contributor-avatar"
          });
          createAndAppend("div", listItem, {
            class: "contributor-data",
            id: "contDataDiv"
          });
        }
*/
      }
    });
  }
  //Information
  function displayInformation(element) {
    let infoDiv = createAndAppend("div", container, {
      id: "divLeft",
      class: "left-div whiteframe"
    });
    createAndAppend("table", infoDiv, { id: "table" });
    createAndAppend("tbody", table, { id: "tbody" });
    createRow("Repository: ", element.name);
    createRow("Description: ", element.description);
    createRow("Forks : ", element.forks);
    createRow("Updated: ", element.updated_at);

    function createRow(label, description) {
      let tRow = createAndAppend("tr", table);
      createAndAppend("td", tRow, { text: label, class: "label" });
      createAndAppend("td", tRow, { text: description });
    }
  }
}
