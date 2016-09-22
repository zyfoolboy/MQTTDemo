{application, emqttd_auth_ldap, [
	{description, "Authentication/ACL with LDAP"},
	{vsn, "2.0"},
	{id, "745ceba-dirty"},
	{modules, ['emqttd_auth_ldap','emqttd_auth_ldap_app']},
	{registered, [emqttd_auth_ldap_sup]},
	{applications, [kernel,stdlib,eldap]},
	{mod, {emqttd_auth_ldap_app, []}}
]}.