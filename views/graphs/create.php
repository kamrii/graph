<?php

use yii\helpers\Html;

$this->title = 'Создать граф';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="graphs-create">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
