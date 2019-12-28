import { BaseUI } from "../../YK/core/UIMgr/UIMgr"
import { EventData } from "../../YK/core/EventMgr/DispatchEventNode"
import JoystickModule from "./JoystickModule"
import GameTestLogic from "./GamePlay/GameTestLogic"

export class GameTestWind extends BaseUI
{
    protected packName = "Main"
    protected resName = "GameWind"
    public modal: boolean = true
    public dontDel: boolean = true
    protected btnNameStartsWith: string = "Btn"
    protected isNeedShowAnimation: boolean = false
    protected isNeedHideAnimation: boolean = false

    private LabelTest : fgui.GTextField;
    private joystick: JoystickModule;

    private gameLogic : GameTestLogic;
    protected OnInitWind()
    {
        this.LabelTest = this.UIObj.get("LabelTest");

        this.gameLogic = new GameTestLogic(this);

        this.gameLogic.gameInit()
        //this.joystick = new JoystickModule(this.contentPane);
        // this.joystick.on(JoystickModule.JoystickMoving, this.onJoystickMoving, this);
        // this.joystick.on(JoystickModule.JoystickUp, this.onJoystickUp, this);
    }

    protected OnShowWind()
    {

    }

    protected OnHideWind()
    {

    }
    protected OnHandler(ev: EventData)
    {

    }

    protected OnBtnClick(ev: fgui.GButton)
    {
        super.OnBtnClick(ev)
        this.hide()
        
        console.log("hiede OnBtnClick="+ev.name)
    }

    private onJoystickMoving(degree: number): void {
        this.LabelTest.text = "" + degree;
    }

    private onJoystickUp(): void {
        this.LabelTest.text = "";
    }
}