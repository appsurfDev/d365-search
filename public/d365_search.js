function openSearchPage() {
    Xrm.Navigation.openWebResource("ks_AlumniSearch", { openInNewWindow: true });
}

function changeSearchBtnColor() {
    setTimeout(() => {
        var element = parent.document.querySelector('[data-id="contact|NoRelationship|HomePageGrid|ks.contact.Button.OpenSearch"]');
        element.style.background='#FC3503';
    }, 500);

    return true
}