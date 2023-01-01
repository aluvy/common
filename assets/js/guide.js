window.addEventListener("load", ()=>{
    
    const wrap = document.querySelector("#wrap");
    const header = document.createElement("header");
    header.innerHTML = `
        <h1><a href="./">common</a></h1>
        <nav>
            <h2 class="blind">navigation area</h2>
            <ul>
                <li><a href="./layout.html">layout</a></li>
                <li><a href="./font.html">font</a></li>
                <li><a href="./form.html">form</a></li>
            </ul>
        </nav>
    `;
    wrap.prepend(header);

    const footer = document.createElement("footer");
    footer.innerHTML = `
        footer
    `;
    wrap.append(footer);

})