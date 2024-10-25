fetch('./goods.json')
//fetching json data
  .then(response => response.json())
  .then(obj => {
    const goods = obj.goods
    const counterBox = document.querySelector(".counter-box")
    const basketBox = document.querySelector(".basket-box")
    const buyButton = document.querySelector(".buy-button")

    //creating div draggable elements
    for (let i = 0; i < goods.length; i++) {
        const box = document.createElement("div")
        box.className = "count"
        box.style.cssText = `width: ${goods[i].width}px; height: ${goods[i].height}px;`

        const child = document.createElement("div")
        child.className = "elem"
        child.style.cssText = `width: ${goods[i].width}px; height: ${goods[i].height}px; background-image: url("${goods[i].img}");`
        child.id = goods[i].id
        child.draggable = true

        box.appendChild(child)
        counterBox.appendChild(box)
    }

    //dnd function
    function handleDropElem (elem, e) {
        e.preventDefault()
        if (e.type !== "drop") {
            return
        }
        let draggedId = e.dataTransfer.getData("drag")
        let draggedEl = document.getElementById(draggedId)

        console.log(e.clientY + draggedEl.offsetHeight)

        let basketEl = basketBox.getBoundingClientRect()

        console.log(basketEl.top + basketEl.height)

        if ((e.clientX < basketEl.left + basketEl.width) && (e.clientX + draggedEl.offsetWidth > basketEl.left) && (e.clientY + draggedEl.offsetHeight > basketEl.top) && (e.clientY + draggedEl.offsetHeight < basketEl.top + basketEl.height + 100)) {
            draggedEl.parentNode.removeChild(draggedEl)
            elem.appendChild(draggedEl)
        }

    }

    //picking dom draggable blocks and elements
    const draggable = document.querySelectorAll('[draggable]')
    const targets = document.querySelectorAll('[data-drop-target]')

    function handleTouchMove (e) {
        let rectEl = e.target.getBoundingClientRect()
        const { clientX, clientY } = e.targetTouches[0];
        e.target.style.left = clientX - rectEl.left + "px";
        e.target.style.top = clientY - rectEl.top + "px";
        e.preventDefault()
    }

    function handleTouchEnd (e) {
        const touch = e.target
        if (basketBox.childElementCount >= 2) {
            buyButton.style.display = "block"
        }
        let rectEl = touch.getBoundingClientRect()
        let xPosition = rectEl.left;
        let yPosition = rectEl.top;

        let basketEl = basketBox.getBoundingClientRect()
        let xBasket = basketEl.left
        let yBasket = basketEl.top

        if ((xPosition < xBasket + basketBox.offsetWidth) && (xPosition + touch.offsetWidth > xBasket) && (yPosition + touch.offsetHeight > yBasket) && (yPosition + touch.offsetHeight < yBasket + basketBox.offsetHeight + 100)) {
            touch.parentNode.removeChild(touch)
            basketBox.appendChild(touch)
        }
        touch.style.left = touch.offsetWidth + "px"
        touch.style.top = "inherit"
        touch.style.position = "absolute";
        touch.style.marginTop = "30px"
        // touch.style.bottom = "px"
        touch.style.zIndex = -1
    }

    function handleTouchStart (e) {
        e.preventDefault()
    }

//adding draggable listeners from elements
    if (!!draggable.length && !!targets.length) {
        for(let i = 0; i < draggable.length; i++) {
            draggable[i].addEventListener("dragstart", e => e.dataTransfer.setData("drag", draggable[i].id));
            draggable[i].addEventListener("touchstart", e => handleTouchStart(e));
            draggable[i].addEventListener("touchmove", e => handleTouchMove(e));
        }
        
        for(let i = 0; i < targets.length; i++) {
            targets[i].addEventListener("dragover", e => handleDropElem(targets[i], e));
            targets[i].addEventListener("drop",  e => handleDropElem(targets[i], e)); 
            targets[i].addEventListener("touchend",  (e) => handleTouchEnd(e)); 
        }
    }
    }
)
