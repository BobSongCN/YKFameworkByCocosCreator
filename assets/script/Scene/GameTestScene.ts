import { SceneBase } from "../../YK/core/SceneMgr/SceneBase";
import { LoadGruopInfo } from "../../YK/core/ResMgr/ResMgr";
import { NetMgr } from "../../YK/core/Net/NetMgr";
import { EventData } from "../../YK/core/EventMgr/DispatchEventNode";
import { UIMgr } from "../../YK/core/UIMgr/UIMgr";
import { GameTestWind } from "../Winds/GameTestWind";
import { BulletItem } from "../Winds/GamePlay/BulletItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameTestScene extends SceneBase
{
    private initNeedLoadTask: LoadGruopInfo
    protected OnInit(param: any)
    {
        super.OnInit(param)

        this.needLoadRes
        .add("UI/Main_atlas0", true)
        .add("UI/Main", true, true)

        console.log("场景初始化")
    }

    private loadItemCompletion()
    {
        console.log("loadItemCompletion")
    }

    /**
     * 资源加载完成
     */
    private loadGameResFinish()
    {
        console.log("loadGameResFinish");
        
    }

    public StartGame()
    {
        let BulletItemUrl = fgui.UIPackage.getItemURL("Main", "BulletItem");

        fgui.UIObjectFactory.setPackageItemExtension(BulletItemUrl, BulletItem);
        console.log("注册组件========")
    }

    protected OnEnter(param: any)
    {
        super.OnEnter(param)
        this.StartGame()
        UIMgr.Instance.ShowWind(GameTestWind)
    }

    protected OnHandler(ev: EventData)
    {
        super.OnHandler(ev)
    }

    protected OnLeave()
    {
        super.OnLeave()
    }

    protected OnDestroy()
    {
        super.OnDestroy()
    }

    protected OnLoaded()
    {
        super.OnLoaded()
    }

    protected OnTaskFinished()
    {
        super.OnTaskFinished()
    }
}
