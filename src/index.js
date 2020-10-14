document.addEventListener("DOMContentLoaded", () => {
    const QUOTES_AND_LIKES_URL = "http://localhost:3000/quotes?_embed=likes"
    const QUOTES_URL = "http://localhost:3000/quotes/"
    const LIKES_URL = "http://localhost:3000/likes/"
    // // const SHOW_LIKES_URL = "http://localhost:3000/likes?quoteId="
    
    const getQuotes = () => {
        fetch(QUOTES_AND_LIKES_URL)
            .then(response => response.json())
            .then(quotes => renderQuotes(quotes))

    }

    const renderQuotes = quotes => {
        quotes.forEach(quoteObj => {
            renderQuote(quoteObj)
        })
    }

    const renderQuote = (quoteObj) => {
       buildQuote(quoteObj)
    }

    const buildQuote = (quoteObj) => {
        let quoteLikes
        if (quoteObj.likes) {
            quoteLikes = quoteObj.likes.length
        } else {
            quoteLikes = 0
        }

        const quoteList = document.querySelector('#quote-list')
        const quoteLi = document.createElement("li")
        quoteLi.classList.add("quote-card")
        quoteLi.setAttribute("author-id", quoteObj.id)
        quoteLi.innerHTML = `
        <blockquote class="blockquote">
        <p class="mb-0">${quoteObj.quote}</p>
        <footer class="blockquote-footer">${quoteObj.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${quoteLikes}</span></button>
        <button class='btn-danger'>Delete</button>
        </blockquote>
        `
        quoteList.append(quoteLi)
    }


    function clickHandler(){
        document.addEventListener("click", e => {
            if (e.target.matches(".btn-danger")){
                const button = e.target
                const quoteCard = button.parentElement.parentElement
                const authorId = quoteCard.getAttribute("author-id")

                const options = {
                    method: "DELETE"
                }

                fetch(QUOTES_URL + authorId, options)
                    .then(response => response.json())
                    .then(_data => {
                        quoteCard.remove()
                    })
            } else if (e.target.matches(".btn-success")){
                const button = e.target
                const quoteId = parseInt(button.parentElement.parentElement.getAttribute("author-id"))
                const span = button.children[0]

                const options = {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        "accept": "application/json"
                    },
                    body: JSON.stringify({quoteId: quoteId})
                }

                fetch(LIKES_URL, options)
                    .then(response => response.json())
                
                fetch(`http://localhost:3000/likes?quoteId=${quoteId}`)
                    .then(response => response.json())
                    .then(likes => span.textContent = `${likes.length}`)


            }
        })
    }

    function submitHandler(){
        document.addEventListener("submit", e => {
            e.preventDefault()
            const form = e.target

            const quote = form.quote.value
            const author = form.author.value
            
            const quoteObj = {quote: quote, author: author}

            const options = {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ quote: quote, author: author })
            }

            fetch(QUOTES_URL, options)
                .then(response => response.json())
                .then(console.log)

            form.reset()
            
        })
    }




    clickHandler()
    submitHandler()
    getQuotes()
})