/**
* Physics Engine
* @class
*/
class PhysicsEngine
{
    /**
    * @param {object} event 
    */
    static CheckRayCasts(event)
    {
        let volume;
        let ray = new RayCast(event.clientX, event.clientY);

        for (let mesh of RenderEngine.Renderables)
        {
            if (!mesh)
			    continue;

            volume = mesh.BoundingVolume();

            if (!volume)
    			continue;

            switch (mesh.BoundingVolumeType()) {
            case "box":
                mesh.Select(ray.RayIntersectAABB(volume.MinBoundaries(), volume.MaxBoundaries()));
                break;
            case "sphere":
                mesh.Select(ray.RayIntersectSphere(volume.MinBoundaries(), volume.MaxBoundaries()));
                break;
            }
        }
    }

    /**
    * @param {object} scope 
    */
    static Update(scope)
    {
        for (let model of scope.components)
        {
            if (model.Type() === ComponentType.CAMERA)
                continue;

            for (let mesh of model.Children) {
                if (mesh && mesh.AutoRotate)
                    mesh.Rotate(mesh.AutoRotation());
            }
        }
    }    
}
