import { Injectable } from '@angular/core';
import { IAction } from '../shared/interfaces/action.interface';

/* App Interfaces and Classes */
import { IElement, ITexture, ITextureCategory, IItem, IItemCategory } from '../shared/interfaces/editor.interface';
import { Surface } from '../shared/lib/surface.class';
import { Thing } from '../shared/lib/thing.class';
import { Material } from '../shared/lib/material.class';
import { IWorkspace } from '../shared/lib/workspace.class';
import { IProject, IProjectsSave } from '../shared/interfaces/project.interface';

@Injectable()
export class EditorActions {
	static readonly CLASS_NAME = 'EDITOR_ACTIONS:';
	/* State Action */
	static readonly INIT_WORKSPACE = EditorActions.CLASS_NAME + 'INIT_WORKSPACE';
	static readonly ACTIVE_METRIC = EditorActions.CLASS_NAME + 'ACTIVE_METRIC';
	static readonly SET_MEASURE = EditorActions.CLASS_NAME + 'SET_MEASURE';
	static readonly INIT_PROJECT = EditorActions.CLASS_NAME + 'INIT_PROJECT';
	static readonly TOGGLE_MOVE = EditorActions.CLASS_NAME + 'TOGGLE_MOVE';
	static readonly TRANSLATE_WORKSPACE = EditorActions.CLASS_NAME + 'TRANSLATE_WORKSPACE';
	static readonly TRANSLATE_TO_WORKSPACE = EditorActions.CLASS_NAME + 'TRANSLATE_TO_WORKSPACE';
	static readonly TRANSLATE_SURFACE = EditorActions.CLASS_NAME + 'TRANSLATE_SURFACE';
	static readonly TRANSLATE_SURFACE_POINT = EditorActions.CLASS_NAME + 'TRANSLATE_SURFACE_POINT';
	static readonly TRANSLATE_THING = EditorActions.CLASS_NAME + 'TRANSLATE_THING';
	static readonly SET_ACTIVE_ELEMENTS = EditorActions.CLASS_NAME + 'SET_ACTIVE_ELEMENTS';
	static readonly SET_MATERIAL = EditorActions.CLASS_NAME + 'SET_MATERIAL';
	static readonly UPDATE_MATERIAL = EditorActions.CLASS_NAME + 'UPDATE_MATERIAL';
	/* Texture Action */
	static readonly ADD_TEXTURE = EditorActions.CLASS_NAME + 'ADD_TEXTURE';
	static readonly ADD_TEXTURES = EditorActions.CLASS_NAME + 'ADD_TEXTURES';
	static readonly ADD_TEXTURE_CATEGORIES = EditorActions.CLASS_NAME + 'ADD_TEXTURE_CATEGORIES';
	/* Manager Action */
	static readonly OPEN_MANAGER_PANEL = EditorActions.CLASS_NAME + 'OPEN_MANAGER_PANEL';
	static readonly CLOSE_ACTIVE_MANAGER_PANEL = EditorActions.CLASS_NAME + 'CLOSE_ACTIVE_MANAGER_PANEL';
	/* Item Action */
	static readonly ADD_ITEM_CATEGORIES = EditorActions.CLASS_NAME + 'ADD_ITEM_CATEGORIES';
	static readonly ADD_ITEMS = EditorActions.CLASS_NAME + 'ADD_ITEMS';
	/* Project Action */
	static readonly SET_WORKSPACE = EditorActions.CLASS_NAME + 'SET_WORKSPACE';
	static readonly UPDATE_PROJECT_NAME = EditorActions.CLASS_NAME + 'UPDATE_PROJECT_NAME';
	static readonly ADD_SURFACE = EditorActions.CLASS_NAME + 'ADD_SURFACE';
	static readonly ADD_THING = EditorActions.CLASS_NAME + 'ADD_THING';
	static readonly UPDATE_SURFACE = EditorActions.CLASS_NAME + 'UPDATE_SURFACE';
	static readonly UPDATE_THING = EditorActions.CLASS_NAME + 'UPDATE_THING';
	static readonly DELETE_ELEMENT = EditorActions.CLASS_NAME + 'DELETE_ELEMENT';
	static readonly SET_PROJECT = EditorActions.CLASS_NAME + 'SET_PROJECT';
	static readonly SAVE_PROJECT = EditorActions.CLASS_NAME + 'SAVE_PROJECT';
	static readonly RESET_PROJECT = EditorActions.CLASS_NAME + 'RESET_PROJECT';

	setMeasure (measure : string) : IAction {
    return {
      type : EditorActions.SET_MEASURE,
			payload : {
				measure : measure
			}
    };
  }
	initWorkspace (state : boolean) : IAction {
    return {
      type : EditorActions.INIT_WORKSPACE,
			payload : {
				state : state
			}
    };
  }
	activeMetric (state : boolean) : IAction {
    return {
      type : EditorActions.ACTIVE_METRIC,
			payload : {
				state : state
			}
    };
  }
	initProject (state : boolean) : IAction {
    return {
      type : EditorActions.INIT_PROJECT,
			payload : {
				state : state
			}
    };
  }
	toggleMove (state : boolean) : IAction {
    return {
      type : EditorActions.TOGGLE_MOVE,
			payload : {
				state : state
			}
    };
  }
	translateWorkspace (arr : Array<number>) : IAction {
    return {
      type : EditorActions.TRANSLATE_WORKSPACE,
			payload : {
				dX : arr[0],
				dY : arr[1]
			}
    };
  }
	translateToWorkspace (arr : Array<number>) : IAction {
    return {
      type : EditorActions.TRANSLATE_TO_WORKSPACE,
			payload : {
				x : arr[0],
				y : arr[1]
			}
    };
  }
	translateSurface (arr : Array<number>) : IAction {
    return {
      type : EditorActions.TRANSLATE_SURFACE,
			payload : {
				dX : arr[0],
				dY : arr[1],
				id : arr[2]
			}
    };
  }
	translateSurfacePoint (arr : Array<number>) : IAction {
    return {
      type : EditorActions.TRANSLATE_SURFACE_POINT,
			payload : {
				dX : arr[0],
				dY : arr[1],
				id : arr[2],
				pid : arr[3]
			}
    };
  }
	translateThing (arr : Array<number>) : IAction {
    return {
      type : EditorActions.TRANSLATE_THING,
			payload : {
				dX : arr[0],
				dY : arr[1],
				id : arr[2]
			}
    };
  }
	setActiveElements (elements : Array<IElement>) : IAction {
    return {
      type : EditorActions.SET_ACTIVE_ELEMENTS,
			payload : {
				elements : elements
			}
    };
  }
	setMaterial (material : Material) : IAction {
    return {
      type : EditorActions.SET_MATERIAL,
			payload : {
				material : material
			}
    };
  }
	updateMaterial (material : Material) : IAction {
    return {
      type : EditorActions.UPDATE_MATERIAL,
			payload : {
				material : material
			}
    };
  }

	/* Texture Action*/
	addTexture (texture : ITexture) : IAction {
		return {
			type : EditorActions.ADD_TEXTURE,
			payload : {
				texture : texture
			}
		};
	}
	addTextures (textures : ITexture[]) : IAction {
		return {
			type : EditorActions.ADD_TEXTURES,
			payload : {
				textures : textures
			}
		};
	}
	addTextureCategories (categories : ITextureCategory[]) : IAction {
		return {
			type : EditorActions.ADD_TEXTURE_CATEGORIES,
			payload : {
				categories : categories
			}
		};
	}

	/* Manager Action */
	openManagerPanel (name : string) : IAction {
		return {
			type : EditorActions.OPEN_MANAGER_PANEL,
			payload : {
				name : name
			}
		};
	}
	closeActiveManagerPanel () : IAction {
		return {
			type : EditorActions.CLOSE_ACTIVE_MANAGER_PANEL
		};
	}
	/* Item Action */
	addItemCategories (categories : IItemCategory[]) : IAction {
		return {
			type : EditorActions.ADD_ITEM_CATEGORIES,
			payload : {
				categories : categories
			}
		};
	}
	addItems (items : IItem[]) : IAction {
		return {
			type : EditorActions.ADD_ITEMS,
			payload : {
				items : items
			}
		};
	}
	/* Project Action */
	setWorkspace (workspace : IWorkspace) : IAction {
    return {
      type : EditorActions.SET_WORKSPACE,
			payload : {
				workspace : workspace
			}
    };
  }
	updateProjectName (name : string) : IAction {
    return {
      type : EditorActions.UPDATE_PROJECT_NAME,
			payload : {
				name : name
			}
    };
  }
	addSurface (surface : Surface) : IAction {
    return {
      type : EditorActions.ADD_SURFACE,
			payload : {
				surface : surface
			}
    };
  }
	addThing (thing : Thing) : IAction {
    return {
      type : EditorActions.ADD_THING,
			payload : {
				thing : thing
			}
    };
  }
	updateSurface (id : number, surface : Surface) : IAction {
    return {
      type : EditorActions.UPDATE_SURFACE,
			payload : {
				id : id,
				surface : surface
			}
    };
  }
	updateThing (id : number, thing : Thing) : IAction {
    return {
      type : EditorActions.UPDATE_THING,
			payload : {
				id : id,
				thing : thing
			}
    };
  }
	deleteElement (elems : Array<IElement>) : IAction {
    return {
      type : EditorActions.DELETE_ELEMENT,
			payload : {
				elems : elems
			}
    };
  }
	setProject (project : IProject) : IAction {
    return {
      type : EditorActions.SET_PROJECT,
			payload : {
				project : project
			}
    };
  }
	saveProject (project : IProjectsSave) : IAction {
    return {
      type : EditorActions.SAVE_PROJECT,
			payload : {
				project : project
			}
    };
  }
	resetProject () : IAction {
    return {
      type : EditorActions.RESET_PROJECT
    };
  }
}
