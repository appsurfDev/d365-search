function openSearchPage() {
    Xrm.Navigation.openWebResource("ks_AlumniSearch", { openInNewWindow: true });
}

function changeSearchBtnColor() {
    setTimeout(() => {
        var element = parent.document.getElementById("contact|NoRelationship|HomePageGrid|ks.contact.Command.OpenSearch10-button")
        element.style.background='#FFFE33';
    }, 1000);

    return true
}