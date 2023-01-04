window.addEventListener("load", ()=>{
    
    const wrap = document.querySelector("#wrap");
    const header = document.createElement("header");
    header.innerHTML = `
        <h1><a href="./">common</a></h1>
        <nav>
            <h2 class="blind">navigation area</h2>
            <ul>
                <li><a href="#layout">layout</a></li>
                <li><a href="#webFont">webFont</a></li>
                <li><a href="#table">table</a></li>
                <li><a href="#form">form</a></li>
                <li><a href="#text">text</a></li>
                <li><a href="#image">image, icon</a></li>
            </ul>
        </nav>
    `;
    wrap.prepend(header);

    const footer = document.createElement("footer");
    footer.innerHTML = `
        footer
    `;
    wrap.append(footer);


    // pre code setting
    const pre = Array.from(document.querySelectorAll(".pre"));
    pre.forEach((item)=>{
        let html = item.innerHTML;
        item.innerHTML = "";

        let elem = document.createElement("pre");
        elem.append(html);
        item.append(elem);
    })


    // page setting
    const container = document.querySelector("#container");
    const section = Array.from(container.querySelectorAll("section"));
    let pages = {};
    section.forEach( (item)=>{
        const id = item.getAttribute("id");
        pages[id] = item;
    })
    // remove section
    container.replaceChildren();

    // page init
    const myPathName = window.location.hash;
    if( myPathName === "" ){
        container.append(eval(pages.layout));
    } else {
        const elem = myPathName.replace("#", "");
        container.append(eval(pages[elem]))
    }

    // navigation event
    const nav = Array.from(document.querySelectorAll("header nav ul li"));
    nav.forEach((item)=> item.addEventListener("click", (e)=>{
        e.preventDefault();
        const href = item.querySelector("a").getAttribute("href");
        const elem = href.replace("#", "");
        window.location.href = href;

        container.replaceChildren(eval(pages[elem]));
        window.scrollTo(0, 0);
    }))

})