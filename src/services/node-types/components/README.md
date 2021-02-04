# Node type components

Components to render nodes in the circuit editor are stored here.

## Does this belong here?

It is convienent to specify components in the definitions, which means the service needs to be
responsible for the components. I typically think of redux services as being purely data, but there's
no actual rule...

Maybe these should be moved into CircuitFieldView and referenced by id... Could let the definitions
specify the component id and some custom props.
