import { GameTestWind } from "../GameTestWind";
import { TimeDelay } from "../../../YK/core/Util/TimeDelay";
import { BulletItem } from "./BulletItem";
import BulletNode from "./BulletNode";
import { UIMgr } from "../../../YK/core/UIMgr/UIMgr";
import { EventData } from "../../../YK/core/EventMgr/DispatchEventNode";

export default class GameTestLogic extends cc.EventTarget {


    public UIObj: Map<string, any> = new Map<string, any>()
    public UICtrls: Map<string, fgui.Controller> = new Map<string, fgui.Controller>()


    private pool: fgui.GObjectPool;
    private defaultItem = "";

    private gameRoot : fgui.GComponent
    private root: GameTestWind
    private touchArea: fgui.GObject;
    private touchCenter: fgui.GComponent;
    private joystickTouch : fgui.GObject;
    private colliderCenter : fgui.GObject;
    private touchId: number;
    private initX: number;
    private initY: number;
    public radius: number;
    /**
     * 中间动效
     */
    private touchCenterAnim : fgui.Transition;

    public weaponItem: fgui.GButton;

    public initDone: boolean;

    /**
     * 是否需要移动时偏移视角
     */
    public needOffset : boolean = false;
    /**
     * x轴最大偏移量
     */
    public maxOffsetNum : number;
    /**
     * 触控区域默认x位置
     */
    public defaultTouchX : number;

    public constructor(root: GameTestWind) {
        super();
        this.pool = new fgui.GObjectPool();
        this.root = root;
        this.gameRoot = root.UIObj.get("GameTouch")
        this.UIObj.clear();
        this.UICtrls.clear();
        for (var index = 0; index < this.gameRoot.numChildren; index++)
        {
            var element = this.gameRoot.getChildAt(index);
            this.UIObj.set(element.name, element)
        }
        this.gameRoot.controllers.forEach(element =>
        {
            this.UICtrls.set(element.name, element)
        });

        this.joystickTouch = this.UIObj.get("JoystickTouch")
        this.touchArea = this.UIObj.get("TouchArea")
        this.touchCenter = this.UIObj.get("JoystickCenter") as fgui.GComponent
        this.touchCenterAnim = this.touchCenter.getTransition("rotate")
        this.weaponItem = this.UIObj.get("WeaponItem")
        this.touchId = -1;
        this.initX = this.touchCenter.x + this.touchCenter.width / 2;
        this.initY = this.touchCenter.y + this.touchCenter.height / 2;
        //半径
        this.radius = 350;

        this.initDone = false

        this.touchArea.on(fgui.Event.TOUCH_BEGIN, this.onTouchDown, this);
        this.touchArea.on(fgui.Event.TOUCH_MOVE, this.onTouchMove, this);
        this.touchArea.on(fgui.Event.TOUCH_END, this.onTouchEnd, this);

        this.colliderCenter = this.UIObj.get("ColliderCenter")
        this.colliderCenter.node.name = "ColliderCenter";
        let collider = this.colliderCenter.node.getComponent(cc.CircleCollider);
        if (collider == null)
        {
            collider = this.colliderCenter.node.addComponent(cc.CircleCollider);
        }
        collider.radius = 10

        this.defaultTouchX = this.gameRoot.x
        let offmultiple = this.gameRoot.width / this.joystickTouch.width
        if(offmultiple < 1.2)
        {
            this.needOffset = true
            this.maxOffsetNum = this.touchArea.height * 2;
        }

        console.log("该分辨率下是否需要挪动视角=",offmultiple,this.needOffset)

        UIMgr.Instance.addEventListener("BulletNodeCollisionEnter",this.test,this)//.DispatchEventByType("BulletNodeCollisionEnter",self)
    }

    public test(ev: EventData)
    {
        let obj = ev.data as cc.BoxCollider
        let com =  obj.node.getComponent(BulletNode)
        if(com != null)
        {
            this.returnToPool(com.gcom)
            ///console.log("tttttttttttttttttt",obj.node)
        }
        return false;
    }

    public get itemPool(): fgui.GObjectPool {
        return this.pool;
    }

    public getFromPool(url: string = null): fgui.GObject {
        if (!url)
            url = this.defaultItem;
        var obj: fgui.GObject = this.pool.getObject(url);
        if (obj != null)
            obj.visible = true;
        return obj;
    }

    public returnToPool(obj: fgui.GObject): void {
        this.pool.returnObject(obj);
    }

    /**
     * 游戏开始初始化
     */
    public gameInit() {
        console.log("game init")
        this.defaultItem = fgui.UIPackage.getItemURL("Main", "BulletItem")
        this.initDone = true
        this.touchCenterAnim.play()
        // console.log("this.gameRoot.width="+this.gameRoot.width);
        // console.log("this.root.width="+this.root.width);
        // console.log("fgui.GRoot.inst.maxWidth="+fgui.GRoot.inst.maxWidth);
        // console.log("JoystickTouch.width="+this.UIObj.get("JoystickTouch").width)
        TimeDelay.Instance.Add(0.2, 0, this.FireOneBullet, this)
    }


    public FireOneBullet() {
        //console.log("开火");

        let obj = this.getFromPool() as BulletItem
        this.gameRoot.addChild(obj);
        obj.x = this.touchArea.x + this.touchArea.width / 2 - obj.width / 2
        obj.y = this.touchArea.y + this.touchArea.height / 2
        obj.rotation = this.touchArea.rotation
        //console.log("初始化=",obj)
        //fgui.registerFont

        this.BulletInit(obj);

        //console.log(obj);
    }

    public BulletInit(bullet: BulletItem) {
        let box = bullet.node.getComponent(cc.BoxCollider)
        if (box == null) {
            box = bullet.node.addComponent(cc.BoxCollider)
        }
        let bnode = bullet.node.getComponent(BulletNode)
        if (bnode == null) {
            bnode = bullet.node.addComponent(BulletNode)
        }
        box.size = new cc.Size(bullet.width, bullet.height);
        bullet.InitData(cc.v2(this.initX,this.initY))

    }

    private onTouchDown(evt: fgui.Event) {
        console.log("onTouchDown")
        if (this.touchId == -1) {//First touch
            this.touchId = evt.touchId;
            
        }
    }
    private onTouchMove(evt: fgui.Event): void {

        if (this.touchId != -1 && evt.touchId == this.touchId) {
            var bx: number = evt.pos.x;
            var by: number = evt.pos.y;

            var angle: number = Math.atan2((by - this.initY), (bx - this.initX)) //以x轴
            var degree: number = angle * (180 / Math.PI)

            var newx = this.initX + this.radius * Math.cos(degree * Math.PI / 180)
            var newy = this.initY + this.radius * Math.sin(degree * Math.PI / 180)

            this.touchArea.x = newx - this.touchArea.width / 2
            this.touchArea.y = newy - this.touchArea.height / 2
            this.touchArea.rotation = degree - 90;
            
            let absDegree = Math.abs(degree)
            //console.log("absDegree="+absDegree)

            let ratio = (90 - absDegree) / 90
            console.log("ratio="+ratio)

            let offset = this.maxOffsetNum * ratio
            this.gameRoot.x = this.defaultTouchX - offset
            //0 = 100%
            //90 0%
            // (90 - abs) / 90
            //console.log("this.touchArea.x="+this.touchArea.x)

            // 90 0
            // 90 - 180 / 90
        }
    }

    private onTouchEnd(evt: fgui.Event): void {
        console.log("onTouchEnd")
        if (this.touchId != -1 && evt.touchId == this.touchId) {
            this.touchId = -1;
        }
    }

    public dispose(): void {
        this.pool.clear();
    }
}