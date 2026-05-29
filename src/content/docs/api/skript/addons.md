---
title: Addons
sidebar:
    order: 20
---

## What is an addon?
Addons, defined by the [SkriptAddon](https://github.com/SkriptLang/Skript/blob/master/src/main/java/org/skriptlang/skript/addon/SkriptAddon.java) interface, are extensions to Skript that provide new features, the most common being new syntax.

## What does an addon provide?
To be able to register new features, such as syntax, you will need access to a SkriptAddon instance.
With an addon instance, you will have write-access to Skript's [registries](../../registries),
enabling [syntax registration](../../syntax), [type registration](../../registries/types), and more.
You can get, store, and remove registries (see below for further detail).

Addons also provide access to the [Localizer](../../localization), which you can use for loading language entries defined by your addon.

## Registering an addon
SkriptAddon instances are obtained by registering an addon through a Skript instance.
Addon registration requires two things:
- The main class (source) of the addon
- A name for the addon (must be unique)

Then, simply call the `registerAddon` method on the Skript instance.
The example below demonstrates registering an addon using the [default Skript instance](../skript-interface#accessing-the-skript-instance):
```java
// MyAddon.java
import ch.njol.skript.Skript;
import org.skriptlang.skript.addon.SkriptAddon;
public class MyAddon extends JavaPlugin {
    @Override
    public void onEnable() {
		SkriptAddon addon = Skript.instance().registerAddon(MyAddon.class, "MyFirstAddon");
    }
}
```

However, is it not strictly required that your addon be a plugin.
Since addons only require a source class and name, you can register your addon from any class (though still preferably the main class).

For example, if you had a way to load an external JAR after Skript loads, the following is possible:
```java
// MyAddon.java
import ch.njol.skript.Skript;
import org.skriptlang.skript.addon.SkriptAddon;
public class MyAddon {
	public static void main(String[] args) {
		SkriptAddon addon = Skript.instance().registerAddon(MyAddon.class, "MyFirstAddon");
	}
}
```

## Addon modules
SkriptAddon instances can also be used to load [AddonModules](https://github.com/SkriptLang/Skript/blob/master/src/main/java/org/skriptlang/skript/addon/AddonModule.java), which allow you to modularize (organize) the features you are registering.
This makes it much easier to control which features of your addon are enabled and which are not.

### Creating an addon module
Addon modules are defined by implementing the AddonModule interface on a class.
The interface defines three methods, though only one is required.

#### canLoad
The `canLoad(SkriptAddon)` method allows you to define the conditions that control whether a module is loaded.
The instance of the addon attempting to load is passed, enabling more precise control.
You must return a `boolean` representing whether the module should continue loading.

#### init
The `init(SkriptAddon)` method is the first stage of module initialization.
This method is intended to be implemented by modules that register components that may be used by other modules, such as [types](../../registries/types).

#### load
The `load(SkriptAddon)` method is the second and final stage of module initialization.
This method is intended to be implemented by modules that register components that are generally only used within the module itself, such as [syntax](../../syntax).

#### name
The `name` method, which is required to be implemented, should just return a name that describes the module's purpose.
For example, if you were creating a module covering math syntax, you could call it `math`.
The module name can really be anything, though, as it does not affect functionality.
It is primarily used for documentation and logging purposes.

#### Example module
The following is a simple example of a module that prints a message when it loads:
```java
// MyModule.java
import org.skriptlang.skript.addon.AddonModule;
public class MyModule implements AddonModule {
	@Override
	public void init(SkriptAddon addon) {
		System.out.println("MyModule has just been initialized by " + addon.name());
	}
	
	@Override
    public void load(SkriptAddon addon) {
		System.out.println("MyModule has just been loaded by " + addon.name());
    }
	
	@Override
    public String name() {
		return "MyModule";
    }
}
```

When `MyModule` is loaded, `init` is run before `load`, so the output will look something like:
```bash title="My Skript Process"
MyModule has just been initialized by ...
MyModule has just been loaded by ...
```

### Loading an addon module
Defined on SkriptAddon is a utility method, `loadModules(AddonModule...)` that loads method.
That is, it first calls `canLoad` on each provided module, compiling a collection of those that are permitted to load.
Then, `init` is called on each module, followed by `load`.
While the order in which these methods are called is guaranteed, there are no guarantees as to the order in which the provided modules are initialized.

Here is an example of loading an addon module, built on the examples from above:
```java
// MyAddon.java
import ch.njol.skript.Skript;
import org.skriptlang.skript.addon.SkriptAddon;
public class MyAddon {
	public static void main(String[] args) {
		Skript skript = ...;
		SkriptAddon addon = skript.registerAddon(MyAddon.class, "MyFirstAddon");
		addon.loadModules(new MyModule());
	}
}
```
### Hierarchical addon modules
We also provide an implementation of AddonModule, [HierarchicalAddonModule](https://github.com/SkriptLang/Skript/blob/master/src/main/java/org/skriptlang/skript/addon/HierarchicalAddonModule.java), which allows defining a module with children (submodules).
This implementation overrides the standard module methods to manage loading the hierarchy.
Instead, implementors can override methods such as `canLoadSelf`, `initSelf` and `loadSelf` which function the same as their regular versions.

The key method of this implementation is `children`, which can be overridden.
The method should return an iterable of the instances of the children modules.

#### Example hierarchical modules
Here is an example of defining a module with a child module:
```java
// MyParentModule.java
import org.skriptlang.skript.addon.HierarchicalAddonModule;
public class MyParentModule implements HierarchicalAddonModule {
	// No special constructor needed since this module will not have a parent (it is the root)

	@Override
	public Iterable<AddonModule> children() {
		// We initialize a new instance of MyChildModule with this module as the parent
		return List.of(new MyChildModule(this));
	}

	@Override
	public void initSelf(SkriptAddon addon) {
		System.out.println("MyParentModule has just been initialized by " + addon.name());
	}

	@Override
    public void loadSelf(SkriptAddon addon) {
		System.out.println("MyParentModule has just been loaded by " + addon.name());
    }

	@Override
    public String name() {
		return "MyParentModule";
    }
}
```
```java
// MyChildModule.java
import org.skriptlang.skript.addon.HierarchicalAddonModule;
public class MyChildModule implements HierarchicalAddonModule {
	// We define a constructor for setting this module's parent
	public MyChildModule(AddonModule parentModule) {
		super(parentModule);
	}

	// MyChildModule has no children, so no need to override 'children'

	@Override
	public void initSelf(SkriptAddon addon) {
		System.out.println("MyChildModule has just been initialized by " + addon.name());
	}

	@Override
    public void loadSelf(SkriptAddon addon) {
		System.out.println("MyChildModule has just been loaded by " + addon.name());
    }

	@Override
    public String name() {
		return "MyChildModule";
    }
}
```

When `MyParentModule` is loaded, its `...Self` methods will always run before the equivalent for its children, meaning the output will look something like:
```bash title="My Skript Process"
MyParentModule has just been initialized by ...
MyChildModule has just been initialized by ...
MyParentModule has just been loaded by ...
MyChildModule has just been loaded by ...
```

## Using registries
SkriptAddon instances provide access to Skript's registries through multiple methods defined on the interface.

:::note
This section does not cover any of the registries defined and used by the API.
For more information about what registries are available, see the [registries](../../registries) section.
:::

### Obtaining registries
A registry can be obtained using the `registry(Class)` method.
It takes a single parameter: the class of the registry to obtain.

:::tip
This method expects that the registry you want to obtain is stored.
You can first call the `hasRegistry(Class)` method if you are not sure whether the registry is stored.
Alternatively, the `registry(Class, Supplier)` method allows you to obtain the registry while passing a supplier to create a new instance of that registry if it is not stored.
If the registry is not stored, and the supplier is invoked, the created registry will be automatically stored.
:::

### Storing registries
Registries can be stored using the `storeRegistry(Class, Registry)` method.
It takes two parameters:
- The class (or superclass) of the registry being stored
- The registry to store

If a registry is already stored under the provided class parameter, it will be replaced.

### Removing registries
Registries can be removed using the `removeRegistry(Class)` method.
It takes a single parameter: the class of the registry to remove.

### Example usage
Let there be a registry `MyRegistry` as something we have implemented in our addon.
The example below demonstrates storing, obtaining, and later removing this registry:
```java
// MyAddon.java
import ch.njol.skript.Skript;
import org.skriptlang.skript.addon.SkriptAddon;
public class MyAddon {
	public static void main(String[] args) {
		Skript skript = ...;
		SkriptAddon addon = skript.registerAddon(MyAddon.class, "MyFirstAddon");
		addon.storeRegistry(MyRegistry.class, new MyRegistry());
		// what if we need to obtain it later? easy enough!
        MyRegistry myRegistry = addon.registry(MyRegistry.class);
		// or what if we want to delete it?
        addon.removeRegistry(MyRegistry.class);
	}
}
```
