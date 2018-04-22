<?php

use yii\helpers\Html;
use yii\widgets\DetailView;


$this->title = $model->name;
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="graphs-view">

    <h1><?= Html::encode($this->title) ?></h1>

    <p>
        <?= Html::a('Перейти к редактированию графа в режиме онлайн', ['online', 'id' => $model->id], ['class' => 'btn btn-info']) ?>
        <?= Html::a('Перейти к редактированию графа', ['graph', 'id' => $model->id], ['class' => 'btn btn-info']) ?>
        <?= Html::a('Редактировать имя', ['update', 'id' => $model->id], ['class' => 'btn btn-primary']) ?>
        <?= Html::a('Удалить', ['delete', 'id' => $model->id], [
            'class' => 'btn btn-danger',
            'data' => [
                'confirm' => 'Вы уверены?',
                'method' => 'post',
            ],
        ]) ?>
    </p>

    <?= DetailView::widget([
        'model' => $model,
        'attributes' => [
            'id',
            'name',
        ],
    ]) ?>

</div>
