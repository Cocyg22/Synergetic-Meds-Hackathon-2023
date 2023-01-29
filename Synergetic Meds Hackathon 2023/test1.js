const usernuminput = document.querySelector('data-num')
const usertitle = document.querySelector('Title-card')
const userCardTemplate = document.querySelector("[data-user-template]")
const userCardContainer = document.querySelector("[data-user-cards-container]")
const searchInput = document.querySelector("[data-search]")
const medicineInput = document.querySelector("[data-search_med]")
const medmessage = document.querySelector('search-message')

var value
var new_name
  medicineInput.addEventListener("input", e => {
    value = e.target.value.toLowerCase()
    document.getElementById("click").onclick = function () {
    new_name = value
    //window.location.href='secondsearch.html'
  var getPost = async function (new_name) {
	var postResp = await fetch('https://rxnav.nlm.nih.gov/REST/rxcui.json?name='+ new_name);
	var post = await postResp.json();
  var string = post.idGroup.rxnormId[0]
  return string;
};

let url_edit = getPost(new_name)

let users = []
searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase()
  users.forEach(user => {
      const isVisbale = user.medicine1.toLowerCase().includes(value) || user.medicine2.toLowerCase().includes(value) || user.severity.toLowerCase().includes(value) || user.Discription.toLowerCase().includes(value)
      user.element.classList.toggle("hide",!isVisbale)
  })
})

url_edit.then(function(result){
  let new_url = "https://rxnav.nlm.nih.gov/REST/interaction/interaction.json?rxcui=" + result + "&sources=DrugBank" 
  fetch(new_url)
.then(res => res.json())
.then (data => {
    users = data.interactionTypeGroup[0].interactionType[0].interactionPair.map(user => {
        const card = userCardTemplate.content.cloneNode(true).children[0]
        let medicine1 = card.querySelector("[data-md]")
        let medicine2 = card.querySelector("[data-mdr]")
        let severity = card.querySelector("[data-severity]")
        let Discription = card.querySelector("[data-description]")
        //medicine1.textContent = user.interactionConcept[0].sourceConceptItem.name
        medicine2.textContent = "Reacts with: " + user.interactionConcept[1].sourceConceptItem.name
        severity.textContent = "Severity Level: " + user.severity
        Discription.textContent = "Discription: " + user.description
        userCardContainer.append(card)
        return{medicine1: user.interactionConcept[0].sourceConceptItem.name, medicine2: user.interactionConcept[1].sourceConceptItem.name, severity: user.severity, Discription: user.description, element: card}
    })
})
})
}
  })