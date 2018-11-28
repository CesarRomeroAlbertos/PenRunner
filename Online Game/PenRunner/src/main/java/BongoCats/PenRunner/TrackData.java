package BongoCats.PenRunner;

public class TrackData {

	private String track;
	private String wallsImage;
	private String wallsCollisionJson;
	private float wallsPositionX;
	private float wallsPositionY;
	private String startImage;
	private float startPositionX;
	private float startPositionY;
	private float startRotation;
	private float startScaleX;
	private String goalImage;
	private float goalPositionX;
	private float goalPositionY;
	private float goalRotation;
	private float goalScaleX;
	private float playerPositionXzero;
	private float playerPositionXone;
	private float playerPositionYzero;
	private float playerPositionYone;
	private float playerAngle;
	private float directionAngle;
	public String getTrack() {
		return track;
	}
	public void setTrack(String track) {
		this.track = track;
	}
	public String getWallsImage() {
		return wallsImage;
	}
	public void setWallsImage(String wallsImage) {
		this.wallsImage = wallsImage;
	}
	public String getWallsCollisionJson() {
		return wallsCollisionJson;
	}
	public void setWallsCollisionJson(String wallsCollisionJson) {
		this.wallsCollisionJson = wallsCollisionJson;
	}
	public float getWallsPositionX() {
		return wallsPositionX;
	}
	public void setWallsPositionX(float wallsPositionX) {
		this.wallsPositionX = wallsPositionX;
	}
	public float getWallsPositionY() {
		return wallsPositionY;
	}
	public void setWallsPositionY(float wallsPositionY) {
		this.wallsPositionY = wallsPositionY;
	}
	public String getStartImage() {
		return startImage;
	}
	public void setStartImage(String startImage) {
		this.startImage = startImage;
	}
	public float getStartPositionX() {
		return startPositionX;
	}
	public void setStartPositionX(float startPositionX) {
		this.startPositionX = startPositionX;
	}
	public float getStartPositionY() {
		return startPositionY;
	}
	public void setStartPositionY(float startPositionY) {
		this.startPositionY = startPositionY;
	}
	public float getStartRotation() {
		return startRotation;
	}
	public void setStartRotation(float startRotation) {
		this.startRotation = startRotation;
	}
	public float getStartScaleX() {
		return startScaleX;
	}
	public void setStartScaleX(float startScaleX) {
		this.startScaleX = startScaleX;
	}
	public String getGoalImage() {
		return goalImage;
	}
	public void setGoalImage(String goalImage) {
		this.goalImage = goalImage;
	}
	public float getGoalPositionX() {
		return goalPositionX;
	}
	public void setGoalPositionX(float goalPositionX) {
		this.goalPositionX = goalPositionX;
	}
	public float getGoalPositionY() {
		return goalPositionY;
	}
	public void setGoalPositionY(float goalPositionY) {
		this.goalPositionY = goalPositionY;
	}
	public float getGoalRotation() {
		return goalRotation;
	}
	public void setGoalRotation(float goalRotation) {
		this.goalRotation = goalRotation;
	}
	public float getGoalScaleX() {
		return goalScaleX;
	}
	public void setGoalScaleX(float goalScaleX) {
		this.goalScaleX = goalScaleX;
	}
	public float getPlayerPositionXzero() {
		return playerPositionXzero;
	}
	public void setPlayerPositionXzero(float playerPositionXzero) {
		this.playerPositionXzero = playerPositionXzero;
	}
	public float getPlayerPositionXone() {
		return playerPositionXone;
	}
	public void setPlayerPositionXone(float playerPositionXone) {
		this.playerPositionXone = playerPositionXone;
	}
	public float getPlayerPositionYzero() {
		return playerPositionYzero;
	}
	public void setPlayerPositionYzero(float playerPositionYzero) {
		this.playerPositionYzero = playerPositionYzero;
	}
	public float getPlayerPositionYone() {
		return playerPositionYone;
	}
	public void setPlayerPositionYone(float playerPositionYone) {
		this.playerPositionYone = playerPositionYone;
	}
	public float getPlayerAngle() {
		return playerAngle;
	}
	public void setPlayerAngle(float playerAngle) {
		this.playerAngle = playerAngle;
	}
	public float getDirectionAngle() {
		return directionAngle;
	}
	public void setDirectionAngle(float directionAngle) {
		this.directionAngle = directionAngle;
	}
	@Override
	public String toString() {
		return "{track=" + track + ", wallsImage=" + wallsImage + ", wallsCollisionJson=" + wallsCollisionJson
				+ ", wallsPositionX=" + wallsPositionX + ", wallsPositionY=" + wallsPositionY + ", startImage="
				+ startImage + ", startPositionX=" + startPositionX + ", startPositionY=" + startPositionY
				+ ", startRotation=" + startRotation + ", startScaleX=" + startScaleX + ", goalImage=" + goalImage
				+ ", goalPositionX=" + goalPositionX + ", goalPositionY=" + goalPositionY + ", goalRotation="
				+ goalRotation + ", goalScaleX=" + goalScaleX + ", playerPositionXzero=" + playerPositionXzero
				+ ", playerPositionXone=" + playerPositionXone + ", playerPositionYzero=" + playerPositionYzero
				+ ", playerPositionYone=" + playerPositionYone + ", playerAngle=" + playerAngle + ", directionAngle="
				+ directionAngle + "}";
	}
}
