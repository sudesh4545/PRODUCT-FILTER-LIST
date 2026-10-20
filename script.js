(function () {
        "use strict";
        var names = [
            "Nebula Headphones",
            "Orbit Keyboard",
            "Pulse Mouse",
            "Prism Lamp",
            "Echo Speaker",
            "Nova Backpack",
            "Pixel Notebook",
            "Flux Charger",
            "Lunar Bottle",
            "Signal Camera",
            "Violet Stand",
            "Ember Watch",
            "Cloud Hub",
            "Night Lens",
            "Aura Cable",
            "Cosmos Case",
            "Zenith Mic",
            "Vector Tablet",
            "Bloom Deskpad",
            "Static Monitor",
            "Drift Earbuds",
            "Cobalt Dock",
            "Rose Controller",
            "Atlas Drive",
          ],
          cats = ["Audio", "Workspace", "Mobile", "Lifestyle"],
          icons = ["◉", "⌨", "◆", "✦", "◖", "▰", "▤", "ϟ", "◒", "◎", "△", "◷"],
          items = names.map(function (n, i) {
            return {
              id: i,
              name: n,
              category: cats[i % 4],
              price: 499 + ((i * 733) % 9200),
              rating: 3.5 + (i % 15) / 10,
              stock: i % 5 !== 0,
              icon: icons[i % icons.length],
              x: ["#7c3aed", "#0284c7", "#db2777", "#dc2626"][i % 4],
              y: "#111827",
            };
          }),
          wish = [],
          compare = [],
          only = false,
          $ = function (x) {
            return document.getElementById(x);
          };
        try {
          wish = JSON.parse(localStorage.getItem("neonshelf:wish") || "[]");
        } catch (x) {}
        cats.forEach(function (c) {
          $("category").add(new Option(c, c));
        });
        function draw() {
          var q = $("search").value.toLowerCase(),
            c = $("category").value,
            s = $("stock").value,
            list = items.filter(function (x) {
              return (
                (!q || x.name.toLowerCase().includes(q)) &&
                (c === "all" || x.category === c) &&
                (s === "all" || x.stock) &&
                (!only || wish.includes(x.id))
              );
            });
          list.sort(function (a, b) {
            return $("sort").value === "low"
              ? a.price - b.price
              : $("sort").value === "high"
                ? b.price - a.price
                : $("sort").value === "rating"
                  ? b.rating - a.rating
                  : a.name.localeCompare(b.name);
          });
          $("count").textContent =
            list.length + " of " + items.length + " sample products";
          $("products").innerHTML = "";
          list.forEach(function (x) {
            var d = document.createElement("article");
            d.className = "product";
            d.innerHTML =
              '<div class="art" style="--x:' +
              x.x +
              ";--y:" +
              x.y +
              '">' +
              x.icon +
              '</div><div class="info"><h3>' +
              x.name +
              "</h3><p>" +
              x.category +
              " · ★ " +
              x.rating.toFixed(1) +
              " · " +
              (x.stock ? "In stock" : "Out of stock") +
              "</p><b>₹" +
              x.price.toLocaleString() +
              '</b><div class="row"><button class="heart">' +
              (wish.includes(x.id) ? "♥" : "♡") +
              '</button><button class="add">Compare</button></div></div>';
            d.querySelector(".heart").onclick = function () {
              wish = wish.includes(x.id)
                ? wish.filter(function (a) {
                    return a !== x.id;
                  })
                : wish.concat(x.id);
              localStorage.setItem("neonshelf:wish", JSON.stringify(wish));
              draw();
            };
            d.querySelector(".add").onclick = function () {
              if (!compare.includes(x.id) && compare.length < 3)
                compare.push(x.id);
              drawCompare();
            };
            $("products").appendChild(d);
          });
          $("wishOnly").textContent = "Wishlist: " + (only ? "On" : "Off");
        }
        function drawCompare() {
          $("compareList").innerHTML = compare.length
            ? ""
            : '<span class="hint">No products selected.</span>';
          compare.forEach(function (id) {
            var x = items[id],
              s = document.createElement("span");
            s.textContent =
              x.name +
              " · ₹" +
              x.price.toLocaleString() +
              " · ★" +
              x.rating.toFixed(1);
            s.onclick = function () {
              compare = compare.filter(function (a) {
                return a !== id;
              });
              drawCompare();
            };
            $("compareList").appendChild(s);
          });
        }
        ["search", "category", "stock", "sort"].forEach(function (id) {
          $(id).oninput = draw;
        });
        $("wishOnly").onclick = function () {
          only = !only;
          draw();
        };
        $("clearCompare").onclick = function () {
          compare = [];
          drawCompare();
        };
        draw();
        drawCompare();
      })();
