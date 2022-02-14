export const fieldsConfig = [
    { title: "Name", field: "fullname", displayName: "Name", schemaName: "fullname", type: "string", showType: "text" },
    { title: "Email", field: "emailaddress1", displayName: "Email", schemaName: "emailaddress1", type: "string", showType: "text" },
    { title: "Preferred Day", field: "preferredappointmentdaycode", displayName: "Preferred Day", schemaName: "preferredappointmentdaycode", type: "optionset", showType: "multiselect" },
    { title: "Job Title", field: "jobtitle", displayName: "Job Title", schemaName: "jobtitle", type: "string", showType: "text" },
    { title: "Payment Terms", field: "paymenttermscode", displayName: "Payment Terms", schemaName: "paymenttermscode", type: "optionset", showType: "multiselect"  },
    { 
        title: "Company", field: "parentcustomerid", displayName: "Company", schemaName: "parentcustomerid", type: "lookup", showType: "multiselect", 
        lookupConfig: { entityName: "account", primaryName: "name", primaryIDName: "accountid", }
    }
]

export const EntityName = "contact"