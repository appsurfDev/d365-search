function openSearchPage() {
    Xrm.Navigation.openWebResource("ks_AlumniSearch", { openInNewWindow: true });
}

function changeSearchBtnColor() {
    setTimeout(() => {
        var element = parent.document.querySelector('[data-id="contact|NoRelationship|HomePageGrid|ks.contact.Button.OpenSearch"]');
        element.style.background='#A02337';

        var searchSpanTextList = Array.from(parent.document.querySelectorAll('span')).find(el => el.textContent === 'Alumni Search');
        searchSpanTextList.children[1].style.setProperty("color", "white", "important");
    }, 500);

    return true
}