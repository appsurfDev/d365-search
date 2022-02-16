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
    { title: "Chinese Name", field: "k_chinesename", displayName: "Chinese Name", schemaName: "ks_chinesename", type: "string", showType: "text" },
    { 
        title: "Gender", field: "ks_genderoptionsenglish", displayName: "Gender", schemaName: "ks_genderoptionsenglish", type: "lookup", showType: "multiselect", 
        lookupConfig: { 
            entityName: "ks_optiongenderenglish", 
            expandName: "ks_GenderOptionsEnglish",
            primaryName: "ks_name", 
            primaryIDName: "ks_optiongenderenglishid", 
        }
    },
    { title: "Preferred Name", field: "ks_preferredname", displayName: "Preferred Name", schemaName: "ks_preferredname", type: "string", showType: "text" },
    { title: "Mobile Phone", field: "mobilephone", displayName: "Mobile Phone", schemaName: "mobilephone", type: "string", showType: "text" },
    { title: "Company Name", field: "ks_companyname", displayName: "Company Name", schemaName: "ks_companyname", type: "string", showType: "text" },
    { title: "Title/Position", field: "ks_titleposition", displayName: "Title/Position", schemaName: "ks_titleposition", type: "string", showType: "text" },
    { title: "LinkedIn URL", field: "ks_linkedinurl", displayName: "LinkedIn URL", schemaName: "ks_linkedinurl", type: "string", showType: "text" },
    { 
        title: "Current Country", field: "ks_currentcountry", displayName: "Current Country", schemaName: "ks_currentcountry", type: "lookup", showType: "multiselect", 
        lookupConfig: { 
            entityName: "ks_optioncountryenglish", 
            expandName: "ks_CurrentCountry",
            primaryName: "ks_name", 
            primaryIDName: "ks_optioncountryenglishid", 
        }
    },
    { title: "Current Province", field: "ks_currentprovince", displayName: "Current Province", schemaName: "ks_currentprovince", type: "string", showType: "text" },
    { title: "Current City", field: "ks_currentcity", displayName: "Current City", schemaName: "ks_currentcity", type: "string", showType: "text" },
]

export const tableConfig = {
    pageSize: 50,
    pageSizeOptions: [25, 50, 100, 200],
    exportFileName: "Alumni_Search_Result",
    exportButton: true, 
    headerStyle: {
      backgroundColor: '#01579b',
      color: '#FFF'
    }
}

export const EntityName = "contact"