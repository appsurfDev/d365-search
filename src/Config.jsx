export const fieldsConfig = [
    { 
        title: "Title", field: "ks_titleoptionsenglish", displayName: "Title", schemaName: "ks_titleoptionsenglish", type: "lookup", showType: "multiselect", 
        lookupConfig: { 
            entityName: "ks_optiontitleenglish", 
            expandName: "ks_TitleOptionsEnglish",
            primaryName: "ks_name", 
            primaryIDName: "ks_optiontitleenglishid", 
        }
    },
    { title: "Chinese Name", field: "ks_chinesename", displayName: "Chinese Name", schemaName: "ks_chinesename", type: "string", showType: "text" },
]

export const tableConfig = {
    pageSize: 50,
    pageSizeOptions: [25, 50, 100, 200],
    exportFileName: "D365_Search_Result",
    exportButton: true, 
    headerStyle: {
      backgroundColor: '#01579b',
      color: '#FFF'
    }
}

export const EntityName = "contact"