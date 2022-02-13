export const fieldsConfig = [
    { displayName: "Name", schemaName: "fullname", type: "string", showType: "text" },
    { displayName: "Email", schemaName: "emailaddress1", type: "string", showType: "text" },
    { displayName: "Preferred Day", schemaName: "preferredappointmentdaycode", type: "optionset", showType: "multiselect" },
    { displayName: "Job Title", schemaName: "jobtitle", type: "string", showType: "text" },
    { displayName: "Payment Terms", schemaName: "paymenttermscode", type: "optionset", showType: "multiselect"  },
    { displayName: "Country", schemaName: "" },
    { 
        displayName: "", schemaName: "", type: "lookup", showType: "multiselect", 
        lookupConfig: { entityName: "", primaryName: "", primaryID: "", }
    }
]

export const TableColumns = [
    { title: 'Full Name', field: 'fullname' },
    { title: 'Email', field: 'emailaddress1' }
]

export const EntityName = "contact"