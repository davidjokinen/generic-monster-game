var Machinegun = Gun.extend({
	init: function (PARENT){
		this.name = "Machinegun";
		this.PARENT = PARENT;
		
		this.title = "Machinegun";

		this.clipMax = 40;
		this.clip = 40;
		this.ammo = 200000;
		this.ammoMax = 200000;

		this.shots = 1;
		this.spread = 6;
		this.distance = 1500;
		this.distanceSpread = 100;
		this.damage = 30;

		this.shotTime = 30;
		this.reloadTime = 2000;

		this.timer = 0;
		this.timerStart = 0;

		this.ID = -1;
		this.status = 0;
	}
});