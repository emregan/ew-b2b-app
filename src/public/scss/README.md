## SCSS

## Workflow
- Auto prefixer takes care of most pre-fixes and issues
- the `global` directory hold the following
	- `_functions.scss`: custom functions [details here](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#functions)
	- `_global.scss`: styles that aren't specific to modules or helper classes
	- `_mixins.scss`: you should know what a mixin is by now [docs](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#mixins)
	- `_variables.scss`: [Link of shame](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#variables_)
- The `partials` directory is where the styles for modules and components go

	
### Use parent selected for modifiers
- Problem: 
	- extremely hard to know element states
	- selectors end up in multiple files
- solution: use parent selector within element
- pros: 
	- discourages nesting
	- Groups all modifications in one place

bad

```
...
.element{
	color: blue;
}
...

.parent{
	.element{
		color: red;
	}
}
...
```

good

```
...
.element{
	color: blue;
	
	.parent &{
		color: red;	
	}
}
...

```