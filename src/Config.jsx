export const fieldsConfig = [
    { 
        title: "Title", 
        field: "ks_titleoptionsenglish", 
        type: "lookup", 
        showType: "multiselect", 
        hide: false,
        lookupConfig: { 
            entityName: "ks_optiontitleenglish", 
            primaryName: "ks_name", 
            primaryIDName: "ks_optiontitleenglishid",
            sortDesc: false
        },
        linkEntityConfig: {
            isLinkEntity: false,
            to: "",
            from: "",
            alias: "",
            linkEntityName: ""
        }
    },
    { 
        title: "Chinese Name", 
        field: "ks_chinesename", 
        type: "string", 
        showType: "text",
        hide: false,
        linkEntityConfig: {
            isLinkEntity: false,
            to: "",
            from: "",
            alias: "",
            linkEntityName: ""
        }
    },
    { 
        title: "Surname", 
        field: "lastname", 
        type: "string", 
        showType: "text",
        hide: false,
        linkEntityConfig: {
            isLinkEntity: false,
            to: "",
            from: "",
            alias: "",
            linkEntityName: ""
        }
    },
    { 
        title: "Given Name", 
        field: "firstname", 
        type: "string", 
        showType: "text",
        hide: false,
        linkEntityConfig: {
            isLinkEntity: false,
            to: "",
            from: "",
            alias: "",
            linkEntityName: ""
        }
    },
    { 
        title: "Preferred Name", 
        field: "ks_preferredname", 
        type: "string", 
        showType: "text",
        hide: false,
        linkEntityConfig: {
            isLinkEntity: false,
            to: "",
            from: "",
            alias: "",
            linkEntityName: ""
        }
    },
    {
        title: "Email", 
        field: "emailaddress1", 
        type: "string", 
        showType: "text",
        hide: false,
        linkEntityConfig: {
            isLinkEntity: false,
            to: "",
            from: "",
            alias: "",
            linkEntityName: ""
        }
    },
    { 
        title: "Mobile", 
        field: "mobilephone", 
        type: "string", 
        showType: "text",
        hide: false,
        linkEntityConfig: {
            isLinkEntity: false,
            to: "",
            from: "",
            alias: "",
            linkEntityName: ""
        }
    },
    {
        title: "Company", 
        field: "ks_companyname", 
        type: "string", 
        showType: "text",
        hide: false,
        linkEntityConfig: {
            isLinkEntity: false,
            to: "",
            from: "",
            alias: "",
            linkEntityName: ""
        }
    },
    {
        title: "Job Title", 
        field: "ks_titleposition", 
        type: "string", 
        showType: "text",
        hide: false,
        linkEntityConfig: {
            isLinkEntity: false,
            to: "",
            from: "",
            alias: "",
            linkEntityName: ""
        }
    },
    { 
        title: "Latest Year of Graduation", 
        field: "ks_optionyearlist", 
        type: "lookup", 
        showType: "multiselect", 
        hide: false,
        lookupConfig: { 
            entityName: "ks_optionyearlist", 
            primaryName: "ks_name", 
            primaryIDName: "ks_optionyearlistid",
            sortDesc: true
        },
        linkEntityConfig: {
            isLinkEntity: true,
            to: "contactid",
            from: "ks_academicrecordslookupid",
            alias: "ac",
            linkEntityName: "ks_academicrecord"
        }
    },
    { 
        title: "Degree", 
        field: "ks_degree", 
        type: "lookup", 
        showType: "multiselect", 
        hide: false,
        lookupConfig: { 
            entityName: "ks_optionalumnidegreeselection", 
            primaryName: "ks_name", 
            primaryIDName: "ks_optionalumnidegreeselectionid",
            sortDesc: false
        },
        linkEntityConfig: {
            isLinkEntity: true,
            to: "contactid",
            from: "ks_academicrecordslookupid",
            alias: "ac",
            linkEntityName: "ks_academicrecord"
        }
    },
    { 
        title: "Faculty / School", 
        field: "ks_facultyschooloptionsenglish", 
        type: "lookup", 
        showType: "multiselect", 
        hide: false,
        lookupConfig: { 
            entityName: "ks_facultyschooloptionsenglish",
            primaryName: "ks_name", 
            primaryIDName: "ks_facultyschooloptionsenglishid",
            sortDesc: false
        },
        linkEntityConfig: {
            isLinkEntity: true,
            to: "contactid",
            from: "ks_academicrecordslookupid",
            alias: "ac",
            linkEntityName: "ks_academicrecord"
        }
    },
    { 
        title: "Department", 
        field: "ks_optiondepartment", 
        type: "lookup", 
        showType: "multiselect", 
        hide: false,
        lookupConfig: { 
            entityName: "ks_optiondepartmentenglish", 
            primaryName: "ks_name", 
            primaryIDName: "ks_optiondepartmentenglishid",
            sortDesc: false
        },
        linkEntityConfig: {
            isLinkEntity: true,
            to: "contactid",
            from: "ks_academicrecordslookupid",
            alias: "ac",
            linkEntityName: "ks_academicrecord"
        }
    },
    { 
        title: "Programme Title", 
        field: "ks_name", 
        type: "string", 
        showType: "text", 
        hide: false,
        linkEntityConfig: {
            isLinkEntity: true,
            to: "contactid",
            from: "ks_academicrecordslookupid",
            alias: "ac",
            linkEntityName: "ks_academicrecord",
            isSubLinkEntity: true,
            subLinkEntityConfig: {
                to: "ks_programtitlelookup",
                from: "ks_optionprogrammetitleid",
                alias: "acp",
                linkEntityName: "ks_optionprogrammetitle",
            }
        }
    },
    { 
        title: "Current Country / Region", 
        field: "ks_currentcountry", 
        type: "lookup", 
        showType: "multiselect", 
        hide: false,
        lookupConfig: { 
            entityName: "ks_optioncountryenglish", 
            primaryName: "ks_name", 
            primaryIDName: "ks_optioncountryenglishid",
            sortDesc: false
        },
        linkEntityConfig: {
            isLinkEntity: false,
            to: "",
            from: "",
            alias: "",
            linkEntityName: ""
        }
    }
]

export const EntityName = "contact"
export const EntityPrimaryIDName = "contactid"