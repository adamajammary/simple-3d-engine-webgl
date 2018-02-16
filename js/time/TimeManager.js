/**
* Time Manager
* @class
*/
class TimeManager
{
    /**
    * @return {number}
    */
    static UpdateDeltaTime()
    {
        var currentTime = performance.now();

        TimeManager.DeltaTime2   = ((currentTime - TimeManager.LastDrawTime) * 0.001);
        TimeManager.DeltaTime    = Math.min(0.03, TimeManager.DeltaTime2);
        TimeManager.LastDrawTime = currentTime;
    }

    /**
    * @param  {number} timePassed
    * @param  {object} scope
    * @return {boolean}
    */
    static UpdateFPS(timePassed, scope)
    {
        if ((parseInt(timePassed % 1000) < 30) && (TimeManager.DeltaTime2 > 0.0)) {
            scope.FPS = parseInt(1.0 / TimeManager.DeltaTime2);
            scope.$apply();
        }
    }
}

TimeManager.LastDrawTime = performance.now();
TimeManager.DeltaTime    = 0.0;
TimeManager.DeltaTime2   = 0.0;
