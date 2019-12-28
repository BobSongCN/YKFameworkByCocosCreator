import { IMode } from "../../YK/core/ModeMgr/ModeMgr";
import { ResponseMessageEvent } from "../../YK/core/Net/ResponseMessageEvent";

export class RoleMode extends IMode {
    public accountInfo = { userid: 0, token: "" }
    public roleInfo: UserData
    public OnInitData(param: any): void {
        this.eventMgr.setNetCallback(this.OnNetEvenet, 99)
        //this.eventMgr.addNetEvent(200);
        this.roleInfo = new UserData();
        this.roleInfo.gem = 0;
        this.roleInfo.maxScore = 0;
        this.roleInfo.roleId = 11;
        this.roleInfo.skill = [];
        this.roleInfo.achievement = [];
    }
    public OnClear(): void {
        
    }

    public updateScore(score: number): void {
        console.log("更新分数")
        if (score > this.roleInfo.maxScore) {
            this.roleInfo.maxScore = score;
        }
    }

    public updateGem(updateNum: number): void {
        this.roleInfo.gem += updateNum;
    }

    public OnDestroy(): void {
        super.OnDestroy()
    }

    public OnNetEvenet(ev: ResponseMessageEvent) {
        if (ev.Data.head.errorcode == 0) {
            if (ev.Data.head.cmd == 200) {

            }
        }

    }

}

class UserData {
    /**
     * 角色id
     */
    public roleId: number;
    /**
     * 宝石数量
     */
    public gem: number;

    /**
     * 技能
     */
    public skill: number[];

    /**
     * 最高得分
     */
    public maxScore: number;
    /**
     * 成就
     */
    public achievement: number[];
}