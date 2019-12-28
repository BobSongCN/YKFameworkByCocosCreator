import BulletNode from "./BulletNode";

export class BulletItem extends fgui.GComponent
{
    private mGTweener : fgui.GTweener = null;
    public constructor()
    {
        super();
        
    }

    public InitData(pos:cc.Vec2)
    {
        let bnode = this.node.getComponent(BulletNode)
        if(bnode != null)
        {
            bnode.bind(this);
        }

        this.StopTween()
        let tw = fgui.GTween.to2(this.x,this.y, pos.x,pos.y, 0.5).setEase(fgui.EaseType.Linear).onUpdate(
            ()=>{
                this.x = tw.value.x
                this.y = tw.value.y
        },this);
        this.mGTweener = tw;
    }

    

    public StopTween()
    {
        if (this.mGTweener != null)
        {
            this.mGTweener.kill()
        }
    }
}